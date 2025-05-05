import 'package:flutter/material.dart';
import 'localization.dart';
import 'providers.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context)!;
    final appState = AppState.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(localizations.translate('profile')),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (appState.user != null) ...[
              Icon(
                Icons.person,
                size: 64,
                color: Theme.of(context).colorScheme.primary,
              ),
              const SizedBox(height: 16),
              Text(
                appState.user?.email ?? 'No email',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () async {
                  try {
                    await appState.signOut();
                    if (context.mounted) {
                      Navigator.pushReplacementNamed(context, '/');
                    }
                  } catch (e) {
                    print('Error signing out: $e');
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Error signing out: $e'),
                          backgroundColor: Theme.of(context).colorScheme.error,
                        ),
                      );
                    }
                  }
                },
                child: Text(localizations.translate('logout')),
              ),
            ] else ...[
              Text(
                localizations.translate('notLoggedIn'),
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/login');
                },
                child: Text(localizations.translate('login')),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/register');
                },
                child: Text(localizations.translate('register')),
              ),
            ],
          ],
        ),
      ),
    );
  }
} 