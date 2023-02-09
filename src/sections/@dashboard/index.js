import React, { useState } from "react";
import {
  Grid,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import useSWR from "swr";
import dashboardInstance from "src/axios/dashboardInstance";
import AppWidgetSummary from "src/components/AppWidgetSummary";
import Loader from "src/components/Loader";

import { css } from "@emotion/css";
import ScrollToBottom from "react-scroll-to-bottom";

import { fetchEventSource } from "@microsoft/fetch-event-source";

import { getToken } from "src/store/localStorage";

const ROOT_CSS = css({
  height: 600,
  width: "100%",
});

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

  const [sellersFile, setSellersFile] = useState(null);
  const [keywordSearchLoading, setKeywordSearchLoading] = useState(false);
  const [sellersFileUploadLoading, setSellersFileUploadLoading] =
    useState(false);

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
    setKeywordsResponse([]);
    setKeywordSearchLoading(true);

    const ctrl = new AbortController();

    await fetchEventSource(
      `${process.env.REACT_APP_DEV_API_URL}/bot/scrap-keyword-products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          keyword: keywordSearch.keyword,
          regionGlobalID: keywordSearch.region,
        }),
        signal: ctrl.signal,

        onopen(res) {
          if (res.ok && res.status === 200) {
            console.log("Connection made ");
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },
        onmessage(ev) {
          const progress = ev.data;

          console.log({ progress });

          setKeywordsResponse((prevState) => [
            ...prevState,
            {
              time: new Date().toLocaleTimeString(),
              log: progress,
            },
          ]);

          if (progress === "Scraping finished") {
            ctrl.abort();
            setKeywordSearchLoading(false);
          }
        },
      }
    );
  };

  const handleSellersFileUpload = async (e) => {
    const file = e.target.files[0];

    setSellersFile(file);
  };

  const handleSellersFileUploadSubmit = async () => {
    setKeywordsResponse([]);

    setSellersFileUploadLoading(true);

    const formData = new FormData();
    formData.append("file", sellersFile);

    const ctrl = new AbortController();

    await fetchEventSource(
      `${process.env.REACT_APP_DEV_API_URL}/bot/scrap-products-from-sellers`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
        signal: ctrl.signal,

        onopen(res) {
          if (res.ok && res.status === 200) {
            console.log("Connection made ");
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },

        onmessage(ev) {
          const progress = ev.data;

          setKeywordsResponse((prevState) => [
            ...prevState,
            {
              time: new Date().toLocaleTimeString(),
              log: progress,
            },
          ]);

          if (progress === "Scraping finished") {
            ctrl.abort();
            setSellersFileUploadLoading(false);
          }
        },
      }
    );
  };

  const renderKeywordsResponse = () => {
    return (
      <Grid container spacing={2} p={2}>
        <Grid
          item
          xs={12}
          md={12}
          sm={12}
          sx={{
            border: "2px solid gray",
            borderRadius: "0.5rem",
          }}
        >
          <ScrollToBottom className={ROOT_CSS}>
            {keywordsResponse.map((response) => {
              return (
                <Grid container spacing={2}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Typography variant="body2" gutterBottom>
                      {response.time}
                    </Typography>
                  </Grid>
                  <Grid item md={10} sm={10} xs={10}>
                    <Typography variant="body2" gutterBottom>
                      {response.log}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </ScrollToBottom>
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
            <Grid item md={12} sm={12} xs={12}>
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
                  keywordSearch.region.length === 0 ||
                  sellersFileUploadLoading
                }
                loading={keywordSearchLoading}
              >
                Scan
              </LoadingButton>
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
                  <Button variant="contained" component="label" fullWidth>
                    Upload sellers file
                    <input
                      hidden
                      accept="application/JSON"
                      multiple
                      type="file"
                      onChange={(e) => {
                        handleSellersFileUpload(e);
                        console.log(e.target.files[0]);
                      }}
                    />
                  </Button>

                  {sellersFile && (
                    <Typography variant="body2">{sellersFile.name}</Typography>
                  )}
                </Grid>
                <Grid item md={12} sm={12}>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    sx={{ width: "100px" }}
                    size="small"
                    onClick={() => {
                      handleSellersFileUploadSubmit();
                    }}
                    disabled={
                      sellersFile === null ||
                      sellersFile === undefined ||
                      sellersFile === "" ||
                      keywordSearchLoading
                    }
                    loading={sellersFileUploadLoading}
                  >
                    Scan
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={12} lg={12} sm={12} xs={12}>
          {keywordsResponse.length > 0 && renderKeywordsResponse()}
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardSection;
