import express from 'express';
import bcrypt from 'bcrypt';
import { createUser, findUserByUsername } from './db/model/user.model.js';

const router = express.Router();

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'lax',
};
const SALT_ROUNDS = 10;

function setUserCookies(res, user) {
    res.cookie('userId', user._id.toString(), COOKIE_OPTIONS);
    res.cookie('username', user.username, COOKIE_OPTIONS);
}

router.get('/isLoggedIn', async function (req, res) {
    if (!req.cookies.userId || !req.cookies.username) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    return res.json({
        user: {
            id: req.cookies.userId,
            username: req.cookies.username,
        },
    });
});

router.post('/register', async function (req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await createUser({ username, passwordHash });
        setUserCookies(res, user);

        return res.status(201).json({
            user: {
                id: user._id.toString(),
                username: user.username,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to register user' });
    }
});

router.post('/login', async function (req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const passwordMatches = user.passwordHash
            ? await bcrypt.compare(password, user.passwordHash)
            : false;

        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        setUserCookies(res, user);

        return res.json({
            user: {
                id: user._id.toString(),
                username: user.username,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to log in' });
    }
});

router.post('/logout', async function (req, res) {
    res.clearCookie('userId');
    res.clearCookie('username');
    return res.json({ ok: true });
});

export default router;
