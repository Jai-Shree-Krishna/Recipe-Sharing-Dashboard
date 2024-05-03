import React, {useState, useEffect} from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "components/BreakdownChart";
import OverviewChart from "components/OverviewChart";
import { useGetDashboardQuery } from "state/api";
import StatBox from "components/StatBox";
import axios from 'axios';



const UserAnalysis = () => {
    const theme = useTheme();
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [data, setData] = useState({});
    const [isloading, setIsLoading] = useState(true);
  
    useEffect(() => {
        const fetchLoginData = async () => {
        try {
            const response = await axios.get("http://localhost:9001/recipes"); // Assuming your API endpoint for login activity data
            setData(response.data);
            console.log(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching login data:", error);
            setIsLoading(false);
        }
        };
        fetchLoginData();
    }, []);

    if(isloading) return ("Loading...");

    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
            </FlexBetween>
        
            <Box
                mt="20px"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="160px"
                gap="20px"
                sx={{
                  "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
                }}
            >

                <StatBox
                    title="Total Users"
                    value= {304}//{data && data.totalCustomers}
                    increase="+14%"
                    description="Since last month"
                    icon={
                        <Email
                        sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
                        />
                    }
                />
                <StatBox
                    title="Current month users"
                    value={100}//{data && data.totalRecipes}
                    increase="+21%"
                    description="Since last month"
                    icon={
                        <PointOfSale
                        sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
                        />
                    }
                />
            </Box>


        
        </Box>
    )

}

export default UserAnalysis;