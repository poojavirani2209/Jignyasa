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
  public learningStyle!: string;
  public goal!: string;
  public days!: number;
  public hoursPerDay!: number;
  public learningPath!: object;
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
    learningStyle: {
      type: Sequelize.DataTypes.STRING,
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
      type: Sequelize.DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "LearnerProfile",
  }
);

User.hasOne(LearnerProfile, { foreignKey: "userId", onDelete: "CASCADE" });
LearnerProfile.belongsTo(User, { foreignKey: "userId" });

export { sequelize, User, LearnerProfile };
