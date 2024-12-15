import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  AuthError
} from 'firebase/auth';
import { handleAuthError } from '../utils/errorHandlers';

export class AuthService {
  constructor(private auth: Auth) {
    this.setPersistence('local').catch(console.error);
  }

  private async setPersistence(type: 'local' | 'session') {
    try {
      await setPersistence(this.auth, 
        type === 'local' ? browserLocalPersistence : browserSessionPersistence
      );
    } catch (error) {
      throw handleAuthError(error as AuthError);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw handleAuthError(error as AuthError);
    }
  }

  async signUp(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw handleAuthError(error as AuthError);
    }
  }

  async signOut() {
    try {
      await firebaseSignOut(this.auth);
    } catch (error) {
      throw handleAuthError(error as AuthError);
    }
  }

  onAuthStateChange(callback: (user: any) => void) {
    return onAuthStateChanged(this.auth, callback);
  }
}