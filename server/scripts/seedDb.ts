import {
  User,
  LearnerProfile,
  LearnerGoal,
  ChatHistory,
  LearnerGoalDocs,
  InteractionLog,
  EmotionLog,
} from "../src/model";

/* WARNING THIS WILL DROP THE CURRENT DATABASE */
seed();

async function seed() {
  // create tables
  await User.sync({ force: true });
  await LearnerProfile.sync({ force: true });
  await LearnerGoal.sync({ force: true });
  await ChatHistory.sync({ force: true });
  await LearnerGoalDocs.sync({ force: true });
  await InteractionLog.sync({ force: true });
  await EmotionLog.sync({ force: true });
  // await LearnerProgress.sync({ force: true });

  //insert data
  await User.create({
    id: 1,
    username: "Shubham",
    password: "Shubham",
  });
}
