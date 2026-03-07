import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./client";

const provider = new GoogleAuthProvider();

/** Google ポップアップでサインイン */
export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(auth, provider);
}

/** サインアウト */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}
