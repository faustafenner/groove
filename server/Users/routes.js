import UsersDao from "./dao.js"; //import the Data Access Object for Users

export default function UserRoutes(app) {
  const dao = UsersDao(); //instantiate dao

  //handler for user sign-in
  const signin = async (req, res) => {
    const { email, password } = req.body; //extract email and password from req body
    const user = await dao.findUserByCredentials(email, password); //call dao method

    if (user) {
      req.session["currentUser"] = user; //store user in session
      const { password: _, ...userWithoutPassword } = user.toObject(); //dont send back password
      res.json(userWithoutPassword); //response 
    } else {
      res.status(401).json({ message: "Invalid email or password" }); //error message
    }
  };

  //handler for user sign-up
  const signup = async (req, res) => {
    const { username, email, password } = req.body;

    const existingEmail = await dao.findUserByEmail(email);
    if (existingEmail) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const existingUsername = await dao.findUserByUsername(username);
    if (existingUsername) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    const newUser = await dao.createUser({
      username,
      email,
      password,
      role: "USER",
    });

    req.session["currentUser"] = newUser;
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.json(userWithoutPassword);
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    const user = await dao.findUserById(currentUser._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  };

  const findUserById = async (req, res) => {
    const { userId } = req.params;
    const user = await dao.findUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  };

  const findAllUsers = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };

  const searchUsers = async (req, res) => {
    const { query } = req.query;
    const users = await dao.findAllUsers();
    
    // Filter out sensitive info and optionally search by username
    const publicUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
    }));
    
    if (query) {
      const filtered = publicUsers.filter(user =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      res.json(filtered);
    } else {
      res.json(publicUsers);
    }
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    if (currentUser._id !== userId && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const updates = req.body;

    if (updates.role && currentUser.role !== "ADMIN") {
      delete updates.role;
    }

    delete updates.password;

    await dao.updateUser(userId, updates);
    const updatedUser = await dao.findUserById(userId);

    if (currentUser._id === userId) {
      req.session["currentUser"] = updatedUser;
    }

    res.json(updatedUser);
  };

  const deleteUser = async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser || currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }

    if (currentUser._id === userId) {
      res.status(400).json({ message: "Cannot delete yourself" });
      return;
    }

    await dao.deleteUser(userId);
    res.sendStatus(200);
  };

  app.post("/api/users/signin", signin);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.get("/api/users/search", searchUsers);
  app.get("/api/users/:userId", findUserById);
  app.get("/api/users", findAllUsers);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
}


