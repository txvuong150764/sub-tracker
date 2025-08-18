'use client';

import { auth, db } from '@/firebase';
import { Subscription } from '@/utils';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthProviderProps = {
  children: ReactNode;
};

export type UserData = {
  subscriptions: Subscription[];
};

export type User = {
  userId: string;
};

type AuthContextType = {
  currentUser: User | null;
  userData: UserData;
  isLoading: boolean;
  signup: (email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  handleAddSubscription: (newSubscription: Subscription) => void;
  handleDeleteSubscription: (index: number) => void;
  handleEditSubscriptionContext: (index: number, updatedSubscription: Subscription) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;

  const [currentUser, setCurrentUser] = useState<User | null>({ userId: '-1' });
  const [userData, setUserData] = useState<UserData>({ subscriptions: [] });
  const [isLoading, setIsLoading] = useState(true);

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setCurrentUser(null);
    setUserData({ subscriptions: [] });
    return auth.signOut();
  }

  async function saveToFirebase(data: Subscription[]) {
    try {
      if (!currentUser) {
        throw new Error('No current user.');
      }
      const userRef = doc(db, 'users', currentUser.userId);
      await setDoc(
        userRef,
        {
          subscriptions: data,
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function handleAddSubscription(newSubscription: Subscription) {
    //remove this line if u put in a paywall and actually are making
    if (userData.subscriptions.length > 30) {
      return;
    }

    // modify the local state (global context)
    const newSubscriptions = [...userData.subscriptions, newSubscription];
    setUserData({ subscriptions: newSubscriptions });

    // write the changes to our firebase database (asynchronous)
    await saveToFirebase(newSubscriptions);
  }

  async function handleDeleteSubscription(index: number) {
    // delete the entry at that index
    const newSubscriptions = userData.subscriptions.filter((val, valIndex) => {
      return valIndex !== index;
    });
    setUserData({ subscriptions: newSubscriptions });

    await saveToFirebase(newSubscriptions);
  }

  async function handleEditSubscriptionContext(
    index: number,
    updatedSubscription: Subscription
  ) {
    const newSubscriptions = userData.subscriptions.map((val, valIndex) => {
      if (valIndex === index) {
        return updatedSubscription;
      }
      return val;
    });
    setUserData({ subscriptions: newSubscriptions });

    await saveToFirebase(newSubscriptions);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setIsLoading(true);
        if (user) {
          setCurrentUser({ userId: user.uid });
        } else {
          setCurrentUser(null);
        }

        if (!user) {
          return;
        }

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            subscriptions: Array.isArray(data.subscriptions)
              ? data.subscriptions
              : [],
          });
        } else {
          setUserData({ subscriptions: [] });
          console.log('No such document!');
        }
      } catch (error) {
        setUserData({ subscriptions: [] });
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    isLoading,
    signup,
    login,
    logout,
    handleAddSubscription,
    handleDeleteSubscription,
    handleEditSubscriptionContext
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
