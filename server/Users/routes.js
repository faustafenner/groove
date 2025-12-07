import UsersDao from "./dao.js";

export default function UserRoutes(app) {
  const dao = UsersDao();

  const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await dao.findUserByCredentials(email, password);
    if (user) {
      req.session["currentUser"] = user;
      const { password: _, ...userWithoutPassword } = user.toObject();
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  };

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
  app.get("/api/users/:userId", findUserById);
  app.get("/api/users", findAllUsers);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
}