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
  public adaptiveLearningStyle: string;
  public retentionRate: number;
  public tutorFeedbackSummary: string;
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
    adaptiveLearningStyle: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    },
    retentionRate: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    },
    tutorFeedbackSummary: {
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

class LearnerGoalDocs extends Sequelize.Model {
  public id!: string;
  public goalId!: string;
  public filename!: string;
  public filepath!: string;
}

LearnerGoalDocs.init(
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      primaryKey: true,
    },
    goalId: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
    },
    filename: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    filepath: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "LearnerGoalDocs",
  }
);

class InteractionLog extends Sequelize.Model {}
InteractionLog.init(
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
    goalId: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    subTopicName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    contentType: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    timeSpentSeconds: {
      type: Sequelize.DataTypes.NUMBER,
      allowNull: false,
    },
    interactionDetails: {
      type: Sequelize.DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "InteractionLog",
  }
);

class EmotionLog extends Sequelize.Model {}
EmotionLog.init(
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
    goalId: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    subTopicName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    imagePath: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    emotion: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    confidence: {
      type: Sequelize.DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "EmotionLog",
  }
);

class ChatHistory extends Sequelize.Model {}
ChatHistory.init(
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
    goalId: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    subTopicName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    messages: {
      type: Sequelize.DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ChatHistory",
  }
);

// class LearnerProgress extends Sequelize.Model {
//   public id!: string;
//   public userId!: string;
//   public goalId!: string;
//   public topicName!: string;
//   public subTopicName!: string;
//   public completedAt!: Date;
// }

// LearnerProfile.init(
//   {
//     id: {
//       type: Sequelize.DataTypes.UUID,
//       defaultValue: Sequelize.DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     userId: {
//       type: Sequelize.DataTypes.UUID,
//       allowNull: false,
//     },

//     goalId: {
//       type: Sequelize.DataTypes.UUID,
//       allowNull: false,
//     },
//     topicName: {
//       type: Sequelize.DataTypes.UUID,
//       allowNull: false,
//     },
//     subTopicName: {
//       type: Sequelize.DataTypes.UUID,
//       allowNull: false,
//     },
//     completedAt: {
//       type: Sequelize.DataTypes.DATE,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: "LearnerProgress",
//   }
// );
User.hasOne(LearnerProfile, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(LearnerGoal, { foreignKey: "userId", onDelete: "CASCADE" });

LearnerProfile.belongsTo(User, { foreignKey: "userId" });
LearnerGoal.belongsTo(User, { foreignKey: "userId" });

export {
  sequelize,
  User,
  LearnerProfile,
  LearnerGoal,
  ChatHistory,
  LearnerGoalDocs,
  InteractionLog,
  EmotionLog,
  // LearnerProgress,
};
