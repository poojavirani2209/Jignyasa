import { User, LearnerProfile, LearnerGoal, ChatHistory } from "../src/model";

/* WARNING THIS WILL DROP THE CURRENT DATABASE */
seed();

async function seed() {
  // create tables
  await User.sync({ force: true });
  await LearnerProfile.sync({ force: true });
  await LearnerGoal.sync({ force: true });
  await ChatHistory.sync({ force: true });
  //insert data
  await User.create({
    id: 1,
    username: "Shubham",
    password: "Shubham",
  });
}
