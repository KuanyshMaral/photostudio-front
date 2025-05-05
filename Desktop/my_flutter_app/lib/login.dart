import 'package:flutter/material.dart';
import 'localization.dart';
import 'providers.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context)!;
    final appState = AppState.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(localizations.translate('login')),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                controller: _emailController,
                decoration: InputDecoration(
                  labelText: localizations.translate('email'),
                  border: const OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) => value!.isEmpty 
                    ? localizations.translate('enterEmail') 
                    : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: InputDecoration(
                  labelText: localizations.translate('password'),
                  border: const OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) => value!.isEmpty 
                    ? localizations.translate('enterPassword') 
                    : null,
              ),
              if (_errorMessage != null)
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: Text(
                    _errorMessage!,
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.error,
                    ),
                  ),
                ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: _isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : ElevatedButton(
                        onPressed: () => _submit(appState),
                        child: Text(localizations.translate('login')),
                      ),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/register');
                },
                child: Text(localizations.translate('register')),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () async {
                  final userCredential = await appState.signInAnonymously();
                  if (userCredential != null) {
                    Navigator.pushReplacementNamed(context, '/');
                  }
                },
                child: Text(localizations.translate('continueAsGuest')),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future _submit(AppState appState) async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      final userCredential = await appState.signIn(
        _emailController.text.trim(),
        _passwordController.text.trim(),
      );

      setState(() => _isLoading = false);

      if (userCredential != null) {
        Navigator.pop(context);
      } else {
        setState(() {
          _errorMessage = 'Invalid email or password';
        });
      }
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
} 