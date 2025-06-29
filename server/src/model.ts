import * as Sequelize from "sequelize";

const sequelize = new Sequelize.Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite3",
});

class User extends Sequelize.Model {}
User.init(
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

class LearnerProfile extends Sequelize.Model {
  public id!: string;
  public userId!: string;
  public userDeclaredlearningStyle!: string;
}

LearnerProfile.init(
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
    },
    userDeclaredlearningStyle: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "LearnerProfile",
  }
);

class LearnerGoal extends Sequelize.Model {
  public id!: string;
  public userId!: string;
  public goal!: string;
  public days!: number;
  public hoursPerDay!: number;
  public learningPath!: JSON;
}

LearnerGoal.init(
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
    },
    goal: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    days: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    hoursPerDay: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    learningPath: {
      type: Sequelize.DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "LearnerGoal",
  }
);

User.hasOne(LearnerProfile, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(LearnerGoal, { foreignKey: "userId", onDelete: "CASCADE" });

LearnerProfile.belongsTo(User, { foreignKey: "userId" });
LearnerGoal.belongsTo(User, { foreignKey: "userId" });

export { sequelize, User, LearnerProfile, LearnerGoal };
