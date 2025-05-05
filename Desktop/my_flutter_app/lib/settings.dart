import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'localization.dart';
import 'providers.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context)!;
    final appState = AppState.of(context);
    final isGuest = appState.isGuest;

    return Scaffold(
      appBar: AppBar(
        title: Text(localizations.translate('settings')),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ListTile(
            title: Text(localizations.translate('theme')),
            trailing: DropdownButton<ThemeMode>(
              value: appState.themeMode,
              onChanged: (ThemeMode? newValue) {
                if (newValue != null) {
                  appState.setThemeMode(newValue);
                  if (!isGuest) {
                    appState.saveUserPreferences(
                      newValue == ThemeMode.dark ? 'dark' : 'light',
                      appState.locale.languageCode,
                    );
                  }
                }
              },
              items: ThemeMode.values.map((ThemeMode mode) {
                return DropdownMenuItem<ThemeMode>(
                  value: mode,
                  child: Text(
                    mode.toString().split('.')[1],
                    style: TextStyle(
                      color: Theme.of(context).textTheme.bodyMedium?.color,
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const Divider(),
          ListTile(
            title: Text(localizations.translate('language')),
            trailing: DropdownButton<Locale>(
              value: appState.locale,
              onChanged: (Locale? newValue) {
                if (newValue != null) {
                  appState.setLocale(newValue);
                  if (!isGuest) {
                    appState.saveUserPreferences(
                      appState.themeMode == ThemeMode.dark ? 'dark' : 'light',
                      newValue.languageCode,
                    );
                  }
                }
              },
              items: const [
                DropdownMenuItem<Locale>(
                  value: Locale('en'),
                  child: Text('English'),
                ),
                DropdownMenuItem<Locale>(
                  value: Locale('ru'),
                  child: Text('Русский'),
                ),
                DropdownMenuItem<Locale>(
                  value: Locale('kk'),
                  child: Text('Қазақша'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class ThemeProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.system;

  ThemeMode get themeMode => _themeMode;

  void setThemeMode(ThemeMode mode) {
    _themeMode = mode;
    notifyListeners();
  }
}

class LocaleProvider extends ChangeNotifier {
  Locale _locale = const Locale('en');

  Locale get locale => _locale;

  void setLocale(Locale locale) {
    _locale = locale;
    notifyListeners();
  }
}