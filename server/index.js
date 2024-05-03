import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

// data imports
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import Recipe from "./models/Recipe.js";
import Chat from "./models/Chat.js";
import Comments from "./models/Comment.js";
import AuthActivity from "./models/AuthActivity.js";

import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from "./data/index.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);



async function getUsersLoginDetails() {
  const year = 2024;
  let loginActivity = await AuthActivity.aggregate([
    {
        $match: {
            activityType: { $in: ['Login'] },
            timestamp: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        }
    },
    {
        $group: {
            _id: { $month: "$timestamp" },
            count: { $sum: 1 }
        }
    },
    {
        $sort: {
            _id: 1
        }
    }
], (err, result) => {
    if (err) {
        // console.error(err);
        // Handle error
    } else {
        // console.log(result);
        return result;
        // Process result
    }
});

return loginActivity;
}

async function getUsersSignupDetails() {
  const year = 2024;
  let signUpActivity = await AuthActivity.aggregate([
    {
        $match: {
            activityType: { $in: ['Signup'] },
            timestamp: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        }
    },
    {
        $group: {
            _id: { $month: "$timestamp" },
            count: { $sum: 1 }
        }
    },
    {
        $sort: {
            _id: 1
        }
    }
  ], (err, result) => {
    if (err) {
        // console.error(err);
        // Handle error
    } else {
        // console.log(result);
        return result;
        // Process result
    }
  });
  return  signUpActivity;
}

function getTop3Recipes() {
  
  return Recipe.aggregate([
    {
      $sort: { visitorsCount: -1 }
    },
    {
      $limit: 3
    }
  ])
  .exec((err, topRecipes) => {
    if (err) {
      console.error(err);
      return err.message;
      // Handle error
      return;
    }
    // console.log("******************///////");
    // console.log(topRecipes);
    return topRecipes;
  });
}

const getCurrentMonthData = async () => {
  
    // Get the start date of the current month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get authentication activity for the current month
    const authActivity = await AuthActivity.find({
      timestamp: { $gte: firstDayOfMonth }
    });

    // Get recipes created during the current month
    const recipes = await Recipe.find({
      createdAt: { $gte: firstDayOfMonth }
    });

    // Get chat messages sent during the current month
    const chatMessages = await Chat.find({
      timestamp: { $gte: firstDayOfMonth }
    });

    // Get comments made during the current month
    const comments = await Comment.find({
      time: { $gte: firstDayOfMonth }
    });

    return {tableInfo: {
      authActivity,
      recipes,
      chatMessages,
      comments
    }};
}
app.get("/homePage/data", async (req, res) => {
  
  try {
    const  totalUsers = await User.countDocuments();
    const totalRecies = await Recipe.countDocuments();
    const totalChats = await Chat.countDocuments();
    const totalComments = await Comments.countDocuments();
    let signinData = await getUsersLoginDetails();
    let signupData = await getUsersSignupDetails();
    
    let signInData = {id: "SignIn Activity", data: signinData};
    let signUpData = {id: "SignUp Activity", data: signupData};
    // const top3Recipes = getTop3Recipes();

    // const tableInfo = await getCurrentMonthData();
    const topRecipes = await Recipe.aggregate([
    {
      $project: {
        title: 1,
        visitorsCount: 1,
        owner: 1,
        dishType: 1,
        category: 1,
        visitorsCount:1
      }
    },
      { $sort: { visitorsCount: -1 } },
      { $limit: 3 }
    ]).exec();

    // console.log(top3Recipes);
    // console.log(totalUsers, totalRecies, totalChats, totalComments);
    res.status(200).json({
      totalUsers,
      totalRecies,
      totalComments,
      totalChats,
      signInData,
      signUpData,
      topRecipes,
      // tableInfo,
    });
  } catch (error) {
    res.status(400).json({"message": error.message});
  }
  
});



/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9001;
mongoose
  .connect("mongodb+srv://kevint11:Kevinmongodb%4011@cluster0.tdcbq1g.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ONLY ADD DATA ONE TIME */
    // AffiliateStat.insertMany(dataAffiliateStat);
    // OverallStat.insertMany(dataOverallStat);
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);
    // User.insertMany(dataUser);
  })
  .catch((error) => console.log(`${error} did not connect`));
