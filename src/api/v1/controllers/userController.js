const express = require('express');
const userRoute = express.Router();

const dataSource = require('../../../database/db')

const UserSchema = require('../../../database/entity/userEntity');
const postUserTable = dataSource.getRepository(UserSchema);

// Register
userRoute.post('/signup', async (req, res) => {
    const { usernamez, email, password } = req.body;

    // Verificar se o email já está cadastrado
    const existingUser = await userRepository.findOne({ email });
    
    if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    try {
        // Criptografar a senha usando o módulo 'crypto'
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

        // Salvar os dados do usuário no banco de dados
        const newUser = userRepository.create({ username, email, password: hashedPassword, salt });
        await userRepository.save(newUser);

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = userRoute;