import 'package:flutter/material.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  static Future<AppLocalizations> load(Locale locale) async {
    final localizations = AppLocalizations(locale);
    await localizations._load();
    return localizations;
  }

  Map<String, String> _localizedStrings = {};

  Future<void> _load() async {
    _localizedStrings = {
      'appTitle': {
        'en': 'Countdown Timer',
        'ru': 'Таймер обратного отсчета',
        'kk': 'Кері санау таймері',
      }[locale.languageCode] ?? 'Countdown Timer',
      'cancel': {
        'en': 'Cancel',
        'ru': 'Отмена',
        'kk': 'Болдырмау',
      }[locale.languageCode] ?? 'Cancel',
      'add': {
        'en': 'Add',
        'ru': 'Добавить',
        'kk': 'Қосу',
      }[locale.languageCode] ?? 'Add',
      'edit': {
        'en': 'Edit',
        'ru': 'Редактировать',
        'kk': 'Өңдеу',
      }[locale.languageCode] ?? 'Edit',
      'update': {
        'en': 'Update',
        'ru': 'Обновить',
        'kk': 'Жаңарту',
      }[locale.languageCode] ?? 'Update',
      'delete': {
        'en': 'Delete',
        'ru': 'Удалить',
        'kk': 'Жою',
      }[locale.languageCode] ?? 'Delete',
      'select': {
        'en': 'Select',
        'ru': 'Выбрать',
        'kk': 'Таңдау',
      }[locale.languageCode] ?? 'Select',
      'upcomingEvents': {
        'en': 'Upcoming Events',
        'ru': 'Предстоящие события',
        'kk': 'Алдағы оқиғалар',
      }[locale.languageCode] ?? 'Upcoming Events',
      'timezone': {
        'en': 'Timezone',
        'ru': 'Часовой пояс',
        'kk': 'Уақыт белдеуі',
      }[locale.languageCode] ?? 'Timezone',
      'currentTime': {
        'en': 'Current Time',
        'ru': 'Текущее время',
        'kk': 'Қазіргі уақыт',
      }[locale.languageCode] ?? 'Current Time',
      'noTimers': {
        'en': 'No timers yet!',
        'ru': 'Таймеров пока нет!',
        'kk': 'Таймерлер әлі жоқ!',
      }[locale.languageCode] ?? 'No timers yet!',
      'addFirstTimer': {
        'en': 'Add your first timer',
        'ru': 'Добавьте первый таймер',
        'kk': 'Алғашқы таймерді қосыңыз',
      }[locale.languageCode] ?? 'Add your first timer',
      'trackDates': {
        'en': 'Track your important dates',
        'ru': 'Отслеживайте важные даты',
        'kk': 'Маңызды күндерді қадағалаңыз',
      }[locale.languageCode] ?? 'Track your important dates',
      'changeTimezone': {
        'en': 'Change Timezone',
        'ru': 'Изменить часовой пояс',
        'kk': 'Уақыт белдеуін өзгерту',
      }[locale.languageCode] ?? 'Change Timezone',
      'hideCompleted': {
        'en': 'Hide completed',
        'ru': 'Скрыть завершенные',
        'kk': 'Аяқталғандарды жасыру',
      }[locale.languageCode] ?? 'Hide completed',
      'showCompleted': {
        'en': 'Show completed',
        'ru': 'Показать завершенные',
        'kk': 'Аяқталғандарды көрсету',
      }[locale.languageCode] ?? 'Show completed',
      'hideHelp': {
        'en': 'Hide help',
        'ru': 'Скрыть справку',
        'kk': 'Анықтаманы жасыру',
      }[locale.languageCode] ?? 'Hide help',
      'showHelp': {
        'en': 'Show help',
        'ru': 'Показать справку',
        'kk': 'Анықтаманы көрсету',
      }[locale.languageCode] ?? 'Show help',
      'about': {
        'en': 'About',
        'ru': 'О приложении',
        'kk': 'Қолданба туралы',
      }[locale.languageCode] ?? 'About',
      'addTimer': {
        'en': 'Add New Timer',
        'ru': 'Добавить таймер',
        'kk': 'Таймер қосу',
      }[locale.languageCode] ?? 'Add New Timer',
      'editTimer': {
        'en': 'Edit Timer',
        'ru': 'Редактировать таймер',
        'kk': 'Таймерді өңдеу',
      }[locale.languageCode] ?? 'Edit Timer',
      'eventName': {
        'en': 'Event Name',
        'ru': 'Название события',
        'kk': 'Оқиға атауы',
      }[locale.languageCode] ?? 'Event Name',
      'enterName': {
        'en': 'Please enter a name',
        'ru': 'Пожалуйста, введите название',
        'kk': 'Атауын енгізіңіз',
      }[locale.languageCode] ?? 'Please enter a name',
      'selectDateTime': {
        'en': 'Select Date & Time',
        'ru': 'Выберите дату и время',
        'kk': 'Күн мен уақытты таңдаңыз',
      }[locale.languageCode] ?? 'Select Date & Time',
      'selectDate': {
        'en': 'Select Date',
        'ru': 'Выберите дату',
        'kk': 'Күнді таңдаңыз',
      }[locale.languageCode] ?? 'Select Date',
      'selectTime': {
        'en': 'Select Time',
        'ru': 'Выберите время',
        'kk': 'Уақытты таңдаңыз',
      }[locale.languageCode] ?? 'Select Time',
      'color': {
        'en': 'Color',
        'ru': 'Цвет',
        'kk': 'Түс',
      }[locale.languageCode] ?? 'Color',
      'target': {
        'en': 'Target',
        'ru': 'Цель',
        'kk': 'Мақсат',
      }[locale.languageCode] ?? 'Target',
      'created': {
        'en': 'Created',
        'ru': 'Создано',
        'kk': 'Құрылған',
      }[locale.languageCode] ?? 'Created',
      'timeRemaining': {
        'en': 'Time remaining',
        'ru': 'Осталось времени',
        'kk': 'Қалған уақыт',
      }[locale.languageCode] ?? 'Time remaining',
      'eventPassed': {
        'en': 'Event passed',
        'ru': 'Событие прошло',
        'kk': 'Оқиға өтті',
      }[locale.languageCode] ?? 'Event passed',
      'deleteTimer': {
        'en': 'Delete Timer?',
        'ru': 'Удалить таймер?',
        'kk': 'Таймерді жою керек пе?',
      }[locale.languageCode] ?? 'Delete Timer?',
      'deleteConfirm': {
        'en': 'Are you sure you want to delete this timer?',
        'ru': 'Вы уверены, что хотите удалить этот таймер?',
        'kk': 'Сіз бұл таймерді жойғыңыз келетініне сенімдісіз бе?',
      }[locale.languageCode] ?? 'Are you sure you want to delete this timer?',
      'selectTimezone': {
        'en': 'Select Timezone',
        'ru': 'Выберите часовой пояс',
        'kk': 'Уақыт белдеуін таңдаңыз',
      }[locale.languageCode] ?? 'Select Timezone',
      'settings': {
        'en': 'Settings',
        'ru': 'Настройки',
        'kk': 'Баптаулар',
      }[locale.languageCode] ?? 'Settings',
      'theme': {
        'en': 'Theme',
        'ru': 'Тема',
        'kk': 'Тақырып',
      }[locale.languageCode] ?? 'Theme',
      'language': {
        'en': 'Language',
        'ru': 'Язык',
        'kk': 'Тіл',
      }[locale.languageCode] ?? 'Language',
      'home': {
        'en': 'Home',
        'ru': 'Главная',
        'kk': 'Басты бет',
      }[locale.languageCode] ?? 'Home',
      'login': {
        'en': 'Login',
        'ru': 'Войти',
        'kk': 'Кіру',
      }[locale.languageCode] ?? 'Login',
      'register': {
        'en': 'Register',
        'ru': 'Регистрация',
        'kk': 'Тіркелу',
      }[locale.languageCode] ?? 'Register',
      'email': {
        'en': 'Email',
        'ru': 'Электронная почта',
        'kk': 'Электрондық пошта',
      }[locale.languageCode] ?? 'Email',
      'password': {
        'en': 'Password',
        'ru': 'Пароль',
        'kk': 'Құпия сөз',
      }[locale.languageCode] ?? 'Password',
      'confirmPassword': {
        'en': 'Confirm Password',
        'ru': 'Подтвердите пароль',
        'kk': 'Құпия сөзді растау',
      }[locale.languageCode] ?? 'Confirm Password',
      'enterEmail': {
        'en': 'Please enter your email',
        'ru': 'Пожалуйста, введите email',
        'kk': 'Электрондық поштаны енгізіңіз',
      }[locale.languageCode] ?? 'Please enter your email',
      'enterPassword': {
        'en': 'Please enter your password',
        'ru': 'Пожалуйста, введите пароль',
        'kk': 'Құпия сөзді енгізіңіз',
      }[locale.languageCode] ?? 'Please enter your password',
      'passwordsDontMatch': {
        'en': 'Passwords do not match',
        'ru': 'Пароли не совпадают',
        'kk': 'Құпия сөздер сәйкес келмейді',
      }[locale.languageCode] ?? 'Passwords do not match',
      'backToLogin': {
        'en': 'Back to Login',
        'ru': 'Вернуться к входу',
        'kk': 'Кіруге оралу',
      }[locale.languageCode] ?? 'Back to Login',
      'profile': {
        'en': 'Profile',
        'ru': 'Профиль',
        'kk': 'Профиль',
      }[locale.languageCode] ?? 'Profile',
      'userInfo': {
        'en': 'User Information',
        'ru': 'Информация о пользователе',
        'kk': 'Пайдаланушы туралы ақпарат',
      }[locale.languageCode] ?? 'User Information',
      'uid': {
        'en': 'User ID',
        'ru': 'ID пользователя',
        'kk': 'Пайдаланушы ID',
      }[locale.languageCode] ?? 'User ID',
      'logout': {
        'en': 'Logout',
        'ru': 'Выйти',
        'kk': 'Шығу',
      }[locale.languageCode] ?? 'Logout',
      'guestMode': {
        'en': 'Guest Mode',
        'ru': 'Гостевой режим',
        'kk': 'Қонақ режимі',
      }[locale.languageCode] ?? 'Guest Mode',
      'notLoggedIn': {
        'en': 'You are not logged in',
        'ru': 'Вы не вошли в систему',
        'kk': 'Сіз жүйеге кірмегенсіз',
      }[locale.languageCode] ?? 'You are not logged in',
      'continueAsGuest': {
        'en': 'Continue as Guest',
        'ru': 'Продолжить как гость',
        'kk': 'Қонақ ретінде жалғастыру',
      }[locale.languageCode] ?? 'Continue as Guest',
    };
  }

  String translate(String key) => _localizedStrings[key] ?? key;
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['en', 'ru', 'kk'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) => AppLocalizations.load(locale);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}