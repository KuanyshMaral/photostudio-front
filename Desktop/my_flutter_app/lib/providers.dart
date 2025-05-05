import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AuthProvider with ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  User? _user;
  bool _isGuest = false;

  User? get user => _user;
  bool get isGuest => _isGuest;
  bool get isAuthenticated => _user != null;

  AuthProvider() {
    _initialize();
  }

  void _initialize() {
    _auth.authStateChanges().listen((User? user) {
      _user = user;
      _isGuest = user == null;
      notifyListeners();
    });
  }

  Future<UserCredential?> signIn(String email, String password) async {
    try {
      final userCredential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      _isGuest = false;
      return userCredential;
    } catch (e) {
      print('Error signing in: $e');
      return null;
    }
  }

  Future<UserCredential?> register(String email, String password) async {
    try {
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      _isGuest = false;
      return userCredential;
    } catch (e) {
      print('Error registering: $e');
      return null;
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
    _isGuest = true;
  }

  Future<void> saveUserPreferences(String theme, String language) async {
    if (_user == null || _isGuest) return;
    await _firestore.collection('users').doc(_user!.uid).set({
      'theme': theme,
      'language': language,
      'lastUpdated': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  Future<Map<String, dynamic>?> getUserPreferences() async {
    if (_user == null || _isGuest) return null;
    final doc = await _firestore.collection('users').doc(_user!.uid).get();
    return doc.data();
  }

  Future<UserCredential?> signInAnonymously() async {
    try {
      final userCredential = await _auth.signInAnonymously();
      _isGuest = true;
      notifyListeners();
      return userCredential;
    } catch (e) {
      print('Error signing in anonymously: $e');
      return null;
    }
  }
}

class ThemeProvider with ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.system;

  ThemeMode get themeMode => _themeMode;

  void setThemeMode(ThemeMode mode) {
    _themeMode = mode;
    notifyListeners();
  }
}

class LocaleProvider with ChangeNotifier {
  Locale _locale = const Locale('en');

  Locale get locale => _locale;

  void setLocale(Locale locale) {
    _locale = locale;
    notifyListeners();
  }
}

class AppState extends InheritedWidget {
  final ThemeMode themeMode;
  final Locale locale;
  final User? user;
  final bool isGuest;
  final Function(ThemeMode) setThemeMode;
  final Function(Locale) setLocale;
  final Function(String, String) signIn;
  final Function(String, String) register;
  final Function() signOut;
  final Future<UserCredential?> Function() signInAnonymously;
  final Future<void> Function(String, String) saveUserPreferences;

  const AppState({
    super.key,
    required super.child,
    required this.themeMode,
    required this.locale,
    required this.user,
    required this.isGuest,
    required this.setThemeMode,
    required this.setLocale,
    required this.signIn,
    required this.register,
    required this.signOut,
    required this.signInAnonymously,
    required this.saveUserPreferences,
  });

  static AppState of(BuildContext context) {
    final AppState? result = context.dependOnInheritedWidgetOfExactType<AppState>();
    assert(result != null, 'No AppState found in context');
    return result!;
  }

  @override
  bool updateShouldNotify(AppState oldWidget) {
    return themeMode != oldWidget.themeMode ||
           locale != oldWidget.locale ||
           user != oldWidget.user ||
           isGuest != oldWidget.isGuest;
  }
}

class AppStateWidget extends StatefulWidget {
  final Widget child;

  const AppStateWidget({super.key, required this.child});

  @override
  State<AppStateWidget> createState() => _AppStateWidgetState();
}

class _AppStateWidgetState extends State<AppStateWidget> {
  ThemeMode _themeMode = ThemeMode.system;
  Locale _locale = const Locale('en');
  User? _user;
  bool _isGuest = true;
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  void _initialize() {
    _auth.authStateChanges().listen((User? user) async {
      setState(() {
        _user = user;
        _isGuest = user == null || user.isAnonymous;
      });
      // Restore preferences if not guest
      if (user != null && !user.isAnonymous) {
        final prefs = await _firestore.collection('users').doc(user.uid).get();
        final data = prefs.data();
        if (data != null) {
          if (data['theme'] == 'light') setState(() => _themeMode = ThemeMode.light);
          if (data['theme'] == 'dark') setState(() => _themeMode = ThemeMode.dark);
          if (data['language'] == 'en') setState(() => _locale = const Locale('en'));
          if (data['language'] == 'ru') setState(() => _locale = const Locale('ru'));
          if (data['language'] == 'kk') setState(() => _locale = const Locale('kk'));
        }
      }
    });
  }

  Future<UserCredential?> _signIn(String email, String password) async {
    try {
      return await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } catch (e) {
      print('Error signing in: $e');
      return null;
    }
  }

  Future<UserCredential?> _register(String email, String password) async {
    try {
      return await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
    } catch (e) {
      print('Error registering: $e');
      return null;
    }
  }

  Future<void> _signOut() async {
    await _auth.signOut();
  }

  Future<UserCredential?> _signInAnonymously() async {
    try {
      final userCredential = await _auth.signInAnonymously();
      setState(() {
        _isGuest = true;
      });
      return userCredential;
    } catch (e) {
      print('Error signing in anonymously: $e');
      return null;
    }
  }

  Future<void> saveUserPreferences(String theme, String language) async {
    if (_user == null || _isGuest) return;
    await _firestore.collection('users').doc(_user!.uid).set({
      'theme': theme,
      'language': language,
      'lastUpdated': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  @override
  Widget build(BuildContext context) {
    return AppState(
      themeMode: _themeMode,
      locale: _locale,
      user: _user,
      isGuest: _isGuest,
      setThemeMode: (mode) => setState(() => _themeMode = mode),
      setLocale: (locale) => setState(() => _locale = locale),
      signIn: _signIn,
      register: _register,
      signOut: _signOut,
      signInAnonymously: _signInAnonymously,
      saveUserPreferences: saveUserPreferences,
      child: widget.child,
    );
  }
} 