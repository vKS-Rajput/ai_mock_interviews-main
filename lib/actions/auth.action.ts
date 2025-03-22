"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  try {
    const cookieStore = cookies(); // No need for `await`

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION * 1000, // milliseconds
    });

    // Set cookie in the browser
    (await
      // Set cookie in the browser
      cookieStore).set("session", sessionCookie, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Error setting session cookie:", error);
  }
}

// Sign Up function
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    if (!uid || !email) {
      return { success: false, message: "Invalid user data" };
    }

    console.log("Checking if user exists:", uid);
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return { success: false, message: "User already exists. Please sign in." };
    }

    // Prepare user data while filtering out `undefined`
    const userData: Record<string, any> = {
      name: name || "Anonymous",
      email: email || "",
    };

    Object.keys(userData).forEach((key) => {
      if (userData[key] === undefined) delete userData[key];
    });

    console.log("Saving user data:", userData);
    await db.collection("users").doc(uid).set(userData);

    return { success: true, message: "Account created successfully. Please sign in." };
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "auth/email-already-exists") {
      return { success: false, message: "This email is already in use" };
    }

    return { success: false, message: "Failed to create account. Please try again." };
  }
}

// Sign In function
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    if (!email) {
      return { success: false, message: "Invalid email" };
    }

    console.log("Fetching user by email:", email);
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return { success: false, message: "User does not exist. Create an account." };
    }

    await setSessionCookie(idToken);
    return { success: true, message: "Logged in successfully." };
  } catch (error: any) {
    console.error("Error signing in:", error);
    return { success: false, message: "Failed to log into account. Please try again." };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  try {
    const cookieStore = cookies();
    (await cookieStore).delete("session");
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("session")?.value;

    if (!sessionCookie) return null;

    console.log("Verifying session cookie...");
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    console.log("Fetching user from Firestore:", decodedClaims.uid);
    const userRecord = await db.collection("users").doc(decodedClaims.uid).get();

    if (!userRecord.exists) return null;

    return { ...userRecord.data(), id: userRecord.id } as User;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null; // Invalid or expired session
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
