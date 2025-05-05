import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Sign in with email and password
  Future<User?> signIn(String email, String password) async {
    try {
      UserCredential result = await _auth.signInWithEmailAndPassword(
          email: email, password: password);
      return result.user;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }

  // Register with email and password
  Future<User?> register(String email, String password) async {
    try {
      UserCredential result = await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
      // Create a new document for the user in Firestore
      await _firestore.collection('users').doc(result.user!.uid).set({
        'email': email,
        'theme': 'system',
        'language': 'en',
      });
      return result.user;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }

  // Sign out
  Future signOut() async {
    try {
      return await _auth.signOut();
    } catch (e) {
      print(e.toString());
      return null;
    }
  }

  // Get user preferences
  Future<Map<String, dynamic>> getUserPreferences(String uid) async {
    DocumentSnapshot doc = await _firestore.collection('users').doc(uid).get();
    return doc.data() as Map<String, dynamic>;
  }

  // Update user preferences
  Future updateUserPreferences(String uid, String theme, String language) async {
    await _firestore.collection('users').doc(uid).update({
      'theme': theme,
      'language': language,
    });
  }
}