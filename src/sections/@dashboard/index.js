import React, { useState } from "react";
import {
  Grid,
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Autocomplete,
  Chip,
  CircularProgress,
  MenuItem,
  Button,
} from "@mui/material";
import botInstance from "src/axios/botInstance";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

import useSWR from "swr";
import dashboardInstance from "src/axios/dashboardInstance";
import AppWidgetSummary from "src/components/AppWidgetSummary";
import Loader from "src/components/Loader";

import Logger from "./logger";

const regions = [
  {
    country: "Austria",
    globalID: "EBAY-AT",
  },
  {
    country: "Australia",
    globalID: "EBAY-AU",
  },
  {
    country: "Belgium",
    globalID: "EBAY-NLBE",
  },
  {
    country: "Belgium (French)",
    globalID: "EBAY-FRBE",
  },
  {
    country: "Canada",
    globalID: "EBAY-CA",
  },
  {
    country: "Canada (English)",
    globalID: "EBAY-ENCA",
  },
  {
    country: "France",
    globalID: "EBAY-FR",
  },
  {
    country: "Germany",
    globalID: "EBAY-DE",
  },
  {
    country: "Hong Kong",
    globalID: "EBAY-HK",
  },
  {
    country: "India",
    globalID: "EBAY-IN",
  },
  {
    country: "Ireland",
    globalID: "EBAY-IE",
  },
  {
    country: "Italy",
    globalID: "EBAY-IT",
  },
  {
    country: "Malaysia",
    globalID: "EBAY-MY",
  },
  {
    country: "Netherlands",
    globalID: "EBAY-NL",
  },
  {
    country: "Philippines",
    globalID: "EBAY-PH",
  },
  {
    country: "Poland",
    globalID: "EBAY-PL",
  },
  {
    country: "Singapore",
    globalID: "EBAY-SG",
  },
  {
    country: "Spain",
    globalID: "EBAY-ES",
  },
  {
    country: "Switzerland",
    globalID: "EBAY-CH",
  },
  {
    country: "United Kingdom",
    globalID: "EBAY-GB",
  },
  {
    country: "United States",
    globalID: "EBAY-US",
  },
];

function DashboardSection() {
  const [keywordSearch, setKeywordSearch] = useState({
    keyword: "",
    error: "",
    region: "",
  });
  const [enteredSellers, setEnteredSellers] = useState({
    sellers: [],
    error: "",
  });
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState([]);

  const [keywordsResponse, setKeywordsResponse] = useState([]);

  const fetchDashboardData = async () => {
    const response = await dashboardInstance.get("/admin");
    return {
      totalProducts: response.data.totalProducts,
      totalSellers: response.data.totalSellers,
    };
  };

  const { data, error, isLoading } = useSWR(
    "/admin-dashboard",
    fetchDashboardData
  );

  if (error) return <div>failed to load</div>;

  if (isLoading) return <Loader />;

  const { totalProducts, totalSellers } = data;

  const handleKeywordSearch = async () => {
    const keyword = keywordSearch.keyword.toLowerCase().replaceAll(" ", "-");
    const eventSource = new EventSource(
      `${process.env.REACT_APP_DEV_API_URL}/bot/scrap-keyword-products?keyword=${keyword}&regionGlobalID=${keywordSearch.region}`
    );

    eventSource.onmessage = (event) => {
      const progress = event.data;
      console.log(`${progress}`);

      setKeywordsResponse((prevState) => [...prevState, progress]);
    };

    // const data = {
    //   keyword: keywordSearch.keyword,
    //   regionGlobalID: keywordSearch.region,
    // };

    // try {
    //   const response = await botInstance.post(`/scrap-keyword-products`, data);
    //   // console.log("Sellers: ", response.data.sellers);

    //   // if (response.data.sellers.length > 0) {
    //   //   setSellers(response.data.sellers);

    //   //   toast.success(response.data.message, {
    //   //     position: "bottom-center",
    //   //     autoClose: 3000,
    //   //     closeOnClick: true,
    //   //     pauseOnHover: true,
    //   //   });
    //   // } else {
    //   //   toast.error("No sellers found for this keyword", {
    //   //     position: "bottom-center",
    //   //     autoClose: 3000,
    //   //     closeOnClick: true,
    //   //     pauseOnHover: true,
    //   //   });
    //   // }
    // } catch (error) {
    //   console.error(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleProductsSearchBySellers = async () => {
    try {
      const response = await botInstance.post(`/scrap-products-from-sellers`, {
        sellers: enteredSellers.sellers,
      });

      toast.success(response.data.message, {
        position: "bottom-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderScannedSellers = () => {
    return (
      sellers.length > 0 && (
        <Grid item xs={12} mt={3}>
          <Typography variant="h6" gutterBottom>
            Scanned Sellers
          </Typography>
          <List>
            {sellers?.map((seller) => (
              <Chip
                label={seller}
                sx={{
                  margin: "0.2rem",
                }}
              />
            ))}
          </List>
        </Grid>
      )
    );
  };

  const renderKeywordsResponse = () => {
    return (
      <Grid
        container
        spacing={2}
        sx={{
          border: "1px solid gray",
          borderRadius: "0.2rem",
          height: "100vh",
          overflowY: "scroll",
        }}
      >
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Keywords Response
          </Typography>

          {keywordsResponse.map((response) => {
            return (
              <Typography variant="body2" gutterBottom>
                {response}
              </Typography>
            );
          })}
        </Grid>
      </Grid>
    );
  };

  return (
    <Container>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AppWidgetSummary
                title="Total Products"
                total={totalProducts}
                color="primary"
                icon="ant-design:ordered-list-outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppWidgetSummary
                title="Total Sellers"
                total={totalSellers}
                color="info"
                icon="ant-design:usergroup-add-outlined"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12}>
              <Typography variant="body1">Scan by keywords</Typography>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item md={7} lg={7} sm={6} xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Enter the product keyword"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={(e) => {
                      setKeywordSearch({
                        ...keywordSearch,
                        keyword: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item md={5} lg={5} sm={6} xs={12}>
                  <TextField
                    fullWidth
                    select={true}
                    label="Region"
                    value={keywordSearch.region}
                    onChange={(e) => {
                      setKeywordSearch({
                        ...keywordSearch,
                        region: e.target.value,
                      });
                    }}
                    size="small"
                  >
                    {regions.map((region) => (
                      <MenuItem key={region.globalID} value={region.globalID}>
                        {region.country}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <LoadingButton
                variant="contained"
                color="primary"
                sx={{ width: "100px" }}
                size="small"
                onClick={() => {
                  handleKeywordSearch();
                }}
                disabled={
                  keywordSearch.keyword.length === 0 ||
                  keywordSearch.region.length === 0
                }
                loading={loading}
              >
                Scan
              </LoadingButton>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              {/* {renderScannedSellers()} */}
              {renderKeywordsResponse()}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12} lg={6} sm={12}>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12}>
              <Typography variant="body1">Scan by sellers</Typography>
            </Grid>
            <Grid item md={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12}>
                  <Autocomplete
                    multiple
                    fullWidth
                    id="tags-filled"
                    options={[]}
                    freeSolo
                    onChange={(event, newValue) => {
                      if (newValue.length > 20) {
                        setEnteredSellers((prev) => {
                          return {
                            ...prev,
                            error: "You can only enter a maximum of 20 sellers",
                          };
                        });
                      } else {
                        setEnteredSellers({
                          sellers: newValue,
                          error: "",
                        });
                      }
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Enter seller names"
                        size="small"
                      />
                    )}
                  />
                </Grid>

                <Grid item md={12}>
                  {enteredSellers.error && (
                    <Typography variant="body2" color="error">
                      {enteredSellers.error}
                    </Typography>
                  )}
                </Grid>
                <Grid item md={12} sm={12}>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    sx={{ width: "100px" }}
                    size="small"
                    onClick={() => {
                      handleProductsSearchBySellers();
                    }}
                    disabled={
                      enteredSellers.sellers.length === 0 ||
                      enteredSellers.error !== ""
                    }
                  >
                    Scan
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardSection;
