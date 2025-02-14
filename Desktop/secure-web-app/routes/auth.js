const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET-маршрут для страницы входа
router.get('/login', (req, res) => {
  res.render('login'); // Рендерим страницу login.ejs
});

// GET-маршрут для страницы регистрации
router.get('/register', (req, res) => {
  res.render('register'); // Рендерим страницу register.ejs
});

// POST-маршрут для регистрации
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// POST-маршрут для входа
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).send('Пользователь не найден');
  }

  if (user.isLocked) {
    return res.status(400).send('Аккаунт заблокирован');
  }

  const isMatch = await user.comparePassword(password);
  if (isMatch) {
    req.session.userId = user._id;
    req.session.username = user.username; // Сохраняем имя пользователя в сессии
    req.session.role = user.role;
    res.redirect('/dashboard');
  } else {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
      user.isLocked = true;
    }
    await user.save();
    res.status(400).send('Неверный пароль');
  }
});

// GET-маршрут для личного кабинета
router.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login'); // Перенаправляем на страницу входа, если пользователь не авторизован
  }
  res.render('dashboard', { username: req.session.username, role: req.session.role }); // Рендерим страницу dashboard.ejs
});

// Выход
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;