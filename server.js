
const express = require('express')
const app = express();
const adminRoute = require('./routes/adminRoute');
const documentRoutes = require('./routes/documentroute')
const path = require('path')
require('dotenv').config();
const { connectDb } = require("./database/db");
const authRoutes = require('./routes/authRoutes');

const User = require('./models/user');

// importations pour google auth
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

// Configuration pour la strategie utilisée
passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({idGoogle: profile.id});
        if(!user) {
            user = await User.create({
                idGoogle: profile.id,
                firstName: profile.name.familyName ? profile.name.familyName : "",
                lastName: profile.name.givenName ? profile.name.givenName : profile.displayName,
                email: profile.emails && profile.emails[0] ? profile.emails[0].value : null
            });
        }
        return done(null, user);
    } catch (error) {
        return done(err, null);
    }
}
));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(passport.initialize());





// Route pour le tableau de bord
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/files', documentRoutes)
app.use('/dashboard', adminRoute);


app.get('/', (_, res) => {
  res.status(200).send('Serveur marche correctement.');
});

connectDb(process.env.MONGO_URI)
.then(() => {
    app.listen(3000, () => {
        console.log("Api on http://localhost:3000");
    })
}) 


