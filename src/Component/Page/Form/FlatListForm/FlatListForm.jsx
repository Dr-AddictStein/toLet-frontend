import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { message } from "antd";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import * as React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../Provider/AuthProvider";
const steps = [
  {
    label: "DESCRIPTION",
  },
  {
    label: "IMAGE",
  },
  {
    label: "CONTACT PERSON",
  },
];

export default function CreateFlatListForm() {
  const mapRef = React.useRef(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [showAddress, setShowAddress] = React.useState(true);
  const [images, setImages] = React.useState([]);
  const [image, setImage] = React.useState([]);
  const [address, setAddress] = React.useState("");
  const [center, setCenter] = React.useState([23.8041, 90.4152]);
  const [openModal, setOpenModal] = React.useState(false);
  const [cityName, setCityName] = React.useState("");
  const [formData, setFormData] = React.useState({
    type: "",
    date: "",
    bedroom: "",
    bathroom: "",
    size: "",
    rent: "",
    address: "",
    city: "",
    postalCode: "",
    firstName: "",
    lastName: "",
    userCity: "",
    phone: "",
    userPostalCode: "",
    image: "",
  });

  console.log("showAddress", showAddress);
  const { auths } = React.useContext(AuthContext);

  const navigate = useNavigate();
  // console.log("user",auths?.user?.email);
 
  //addressChanged Handler
const closeHandleModal=()=>{
 setOpenModal(false)
 setShowAddress(false)
}


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, checked, value, files } = e.target;

    if (name === "flat" || name === "sublet") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        type: checked ? name : "",
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    if (name === "images" && files && files.length > 0) {
      const filesArray = Array.from(files);

      // const filesToAdd = filesArray.slice(0, -1);
      setImages((prevImages) => [...prevImages, ...filesArray]);
    }
    if (name === "image" && files && files.length > 0) {
      // Handle single file differently
      const selectedFile = files[files.length - 1];
      setImage(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("userEmail", auths?.user?.email);
      formDataToSend.append("userId", auths?.user?._id);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("availableFrom", formData.date);
      formDataToSend.append("bedroom", formData.bedroom);
      formDataToSend.append("bathroom", formData.bathroom);
      formDataToSend.append("size", formData.size);
      formDataToSend.append("rent", formData.rent);
      formDataToSend.append("lat", center[0]);
      formDataToSend.append("lon", center[1]);
      formDataToSend.append("address", address);
      formDataToSend.append("city", cityName);
      formDataToSend.append("postalCode", formData.postalCode);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("userCity", formData.userCity);
      // image.forEach((image, index) => {
      //     formDataToSend.append("image", image);
      // });
      if (image) {
        formDataToSend.append("image", image);
      }
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("userPostalCode", formData.userPostalCode);
      images.forEach((images, index) => {
        formDataToSend.append("images", images);
      });
      console.log(formData);
      const response = await fetch("http://localhost:5000/add/flatList", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        message.success("Form submitted successfully!");
        // console.log("Form data submitted successfully");
        navigate("/");
      } else {
        console.error("Failed to submit form data");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };
  //new code

  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext1 = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  // Custom hook to handle map events
  const MapEvents = () => {
    const map = useMapEvents({
      click: handleClick,
    });

    return null;
  };
 
  console.log(address, "ggdgsdhgdhj");
  //   console.log(defaultAddress);
  const handleClick = (event) => {
    const { lat, lng } = event.latlng;
    // console.log(event);
    axios
      .get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      .then((response) => {
        // console.log(response.data.display_name);
        // You can now use the address in your application
        setOpenModal(false);
        setAddress(response.data.display_name);
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
      });
  };



  React.useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, 13);
    }
  }, [center]);

  const handleDistrictChange = async (event) => {
    const selectedCityName = event.target.value;
    setCityName(selectedCityName);
    const { data } = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${selectedCityName}`
    );
    if (data.length > 0) {
      setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    }
    setOpenModal(true);
  };

  const districts = [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];

  const map = (
    <MapContainer
      center={center}
      zoom={30}
      style={{
        height: "400px",
        width: "100%",
      }}
      ref={mapRef}
    >
      <MapEvents />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );

  return (
    <>
      <div className="flex justify-center mt-5">
        <div className=" w-6/12  md:block hidden">
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep}>
              {steps.map((labels, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption"></Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={index} {...stepProps}>
                    <StepLabel {...labelProps}>{labels.label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    pt: 2,
                  }}
                >
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }} style={{ marginTop: "45px" }}>
                  {activeStep === 0 && (
                    <form>
                      <Grid container spacing={1}>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Type</InputLabel>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.type.flat}
                                onChange={handleChange}
                                name="flat"
                                color="primary"
                              />
                            }
                            label="Flat"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.type.sublet}
                                onChange={handleChange}
                                name="sublet"
                                color="primary"
                              />
                            }
                            label="Sublet"
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Date</InputLabel>
                          <TextField
                            fullWidth
                            required
                            name="date"
                            type="date"
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Bedroom</InputLabel>
                          <div>
                            {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                              <FormControlLabel
                                key={number}
                                control={
                                  <Checkbox
                                    checked={formData.bedroom.includes(
                                      number.toString()
                                    )}
                                    onChange={handleChange}
                                    name="bedroom"
                                    value={number.toString()}
                                    color="primary"
                                  />
                                }
                                label={number}
                              />
                            ))}
                          </div>
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Bathroom</InputLabel>
                          <div>
                            {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                              <FormControlLabel
                                key={number}
                                control={
                                  <Checkbox
                                    checked={formData.bathroom.includes(
                                      number.toString()
                                    )}
                                    onChange={handleChange}
                                    name="bathroom"
                                    value={number.toString()}
                                    color="primary"
                                  />
                                }
                                label={number}
                              />
                            ))}
                          </div>
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Size (sqft)</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="number"
                            name="size"
                            type="number"
                            autoComplete="number"
                            autoFocus
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Rent</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="number"
                            name="rent"
                            type="number"
                            autoComplete="number"
                            autoFocus
                            onChange={handleChange}
                          />
                        </Grid>

                        <Grid item sm={12} md={6}>
                          <InputLabel>City</InputLabel>
                          <FormControl
                            sx={{
                              width: "100%",
                              "@media (max-width: 768px)": {
                                minWidth: "unset",
                              },
                            }}
                          >
                            <Select
                              onChange={handleDistrictChange}
                              displayEmpty
                              inputProps={{
                                "aria-label": "Without label",
                              }}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {districts.map((district, index) => (
                                <MenuItem key={index} value={district}>
                                  {district}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>Select a district</FormHelperText>
                              
                          </FormControl>
                        </Grid>
                        {
                          <Grid item sm={12} md={6}>
                            <InputLabel>Address</InputLabel>

                            {showAddress ? (
                              <TextField
                                required
                                fullWidth
                                value={address}
                                id="name"
                                name="address"
                                placeholder="Address"
                              />
                            ) : (
                              <input
                                required
                                fullWidth
                                id="name"
                                name="address"
                                className="w-full px-5 py-3.5 border rounded-md"
                                placeholder="Enter Your Address"
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            )}
                          
                          </Grid>
                        }
                        <Grid item sm={12} md={12}>
                          <InputLabel>Zip Code</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="number"
                            name="postalCode"
                            type="number"
                            autoComplete="number"
                            autoFocus
                            placeholder="Zip code (optional)"
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </form>
                  )}

                  {activeStep === 1 && (
                    <form>
                      <Grid container spacing={1}>
                        <Grid item sm={12} md={12}>
                          <div className="lg:col-span-2 rounded-lg border-4 border-dashed w-full group text-center py-5">
                            <label>
                              <div>
                                <img
                                  className="w-20 h-20 mx-auto object-center cursor-pointer"
                                  src="https://i.ibb.co/GJcs8tx/upload.png"
                                  alt="upload image"
                                />
                                <p>Drag your images here </p>
                                <p className="text-gray-600 text-xs">
                                  Only *.jpeg, *.webp and *.png images will be
                                  accepted
                                </p>
                              </div>
                              <input
                                type="file"
                                multiple
                                name="images"
                                className="hidden"
                                onChange={handleChange}
                              />
                            </label>
                          </div>
                        </Grid>
                      </Grid>
                    </form>
                  )}

                  {activeStep === 2 && (
                    <form>
                      <div className="flex justify-center gap-6 mt-12">
                        <Paper>
                          <Box
                            component="form"
                            sx={{
                              "& .MuiTextField-root": { mt: 1 },
                            }}
                          >
                            <Grid container spacing={1}>
                              <Grid item sm={12} md={12}>
                                <InputLabel>First Name</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  name="firstName"
                                  autoComplete="firstName"
                                  type="text"
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid item sm={12} md={12}>
                                <InputLabel>Last Name</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  name="lastName"
                                  type="text"
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid item sm={12} md={12}>
                                <InputLabel>Address</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  id="address"
                                  name="address"
                                  autoComplete="address"
                                  autoFocus
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid item sm={12} md={6}>
                                <InputLabel>Enter City</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  name="userCity"
                                  type="text"
                                  placeholder="userCity"
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid item sm={12} md={12}>
                                <InputLabel>Zip Code</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  id="number"
                                  name="userPostalCode"
                                  type="number"
                                  autoComplete="userPostalCode"
                                  autoFocus
                                  placeholder="userPostalCode"
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid item sm={12} md={12}>
                                <InputLabel>Contact Number</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  id="phone"
                                  name="phone"
                                  type="tel"
                                  autoComplete="tel"
                                  autoFocus
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid item sm={12} md={12}>
                                <div>
                                  <img
                                    className="w-20 h-20 mx-auto object-center cursor-pointer"
                                    src="https://i.ibb.co/GJcs8tx/upload.png"
                                    alt="upload image"
                                  />
                                </div>
                                <input
                                  type="file"
                                  name="image"
                                  onChange={handleChange}
                                  className=""
                                />
                              </Grid>
                            </Grid>
                            {formData.type &&
                            formData.date &&
                            formData.bedroom &&
                            formData.bathroom &&
                            formData.size &&
                            formData.rent &&
                            cityName &&
                            address &&
                            images.length > 0 &&
                            formData.firstName &&
                            formData.lastName &&
                            formData.userCity &&
                            formData.phone &&
                            image ? (
                              <Button
                                type="submit"
                                fullWidth
                                onClick={handleSubmit}
                                variant="contained"
                                sx={{
                                  mt: 3,
                                  mb: 2,
                                }}
                              >
                                Submit
                              </Button>
                            ) : (
                              <button
                                disabled
                                className="bg-gray-300 w-full py-2 px-3 my-2"
                              >
                                Submit
                              </button>
                            )}
                          </Box>
                        </Paper>
                      </div>
                    </form>
                  )}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    pt: 2,
                  }}
                >
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                 
                  {activeStep === 0 &&
                    formData.type &&
                    formData.date &&
                    formData.bedroom &&
                    formData.bathroom &&
                    formData.size &&
                    formData.rent &&
                    cityName &&
                    address && (
                      <Button onClick={handleNext1}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    )}
                  {activeStep === 1 && images.length > 0 && (
                    <Button onClick={handleNext1}>
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </Box>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="md:hidden overflow-hidden">
          <Box sx={{ maxWidth: 270 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    optional={
                      index === 2 ? (
                        <Typography variant="caption">Last step</Typography>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <div>
                      {index === 0 && (
                        <form>
                          <Grid container spacing={1}>
                            <Grid item sm={12} md={6}>
                              <InputLabel>Type</InputLabel>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.type.flat}
                                    onChange={handleChange}
                                    name="flat"
                                    color="primary"
                                  />
                                }
                                label="Flat"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.type.sublet}
                                    onChange={handleChange}
                                    name="sublet"
                                    color="primary"
                                  />
                                }
                                label="Sublet"
                              />
                            </Grid>
                            <Grid item sm={12} md={6}>
                              <InputLabel>Date</InputLabel>
                              <TextField
                                required
                                fullWidth
                                name="date"
                                type="date"
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid item sm={12} md={6}>
                              <InputLabel>Bedroom</InputLabel>
                              <div>
                                {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                                  <FormControlLabel
                                    key={number}
                                    control={
                                      <Checkbox
                                        checked={formData.bedroom.includes(
                                          number.toString()
                                        )}
                                        onChange={handleChange}
                                        name="bedroom"
                                        value={number.toString()}
                                        color="primary"
                                      />
                                    }
                                    label={number}
                                  />
                                ))}
                              </div>
                            </Grid>
                            <Grid item sm={12} md={6}>
                              <InputLabel>Bathroom</InputLabel>
                              <div>
                                {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                                  <FormControlLabel
                                    key={number}
                                    control={
                                      <Checkbox
                                        checked={formData.bathroom.includes(
                                          number.toString()
                                        )}
                                        onChange={handleChange}
                                        name="bathroom"
                                        value={number.toString()}
                                        color="primary"
                                      />
                                    }
                                    label={number}
                                  />
                                ))}
                              </div>
                            </Grid>
                            <Grid item sm={12} md={6}>
                              <InputLabel>Size (sqft)</InputLabel>
                              <TextField
                                required
                                fullWidth
                                id="number"
                                name="size"
                                type="number"
                                autoComplete="number"
                                autoFocus
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid item sm={12} md={6}>
                              <InputLabel>Rent</InputLabel>
                              <TextField
                                required
                                fullWidth
                                id="number"
                                name="rent"
                                type="number"
                                autoComplete="number"
                                autoFocus
                                onChange={handleChange}
                              />
                            </Grid>
                         
                            <Grid item sm={12} md={6}>
                              <InputLabel>City</InputLabel>
                              <FormControl
                                sx={{
                                  width: "100%",
                                  "@media (max-width: 768px)": {
                                    minWidth: "unset",
                                  },
                                }}
                              >
                                <Select
                                  onChange={handleDistrictChange}
                                  displayEmpty
                                  inputProps={{
                                    "aria-label": "Without label",
                                  }}
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {districts.map((district, index) => (
                                    <MenuItem key={index} value={district}>
                                      {district}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText>
                                  Select a district
                                </FormHelperText>
                                  
                              </FormControl>
                            </Grid>
                            {
                          <Grid item sm={12} md={6}>
                            <InputLabel>Address</InputLabel>

                            {showAddress ? (
                              <TextField
                                required
                                fullWidth
                                value={address}
                                id="name"
                                name="address"
                                placeholder="Address"
                              />
                            ) : (
                              <input
                                required
                                fullWidth
                                id="name"
                                name="address"
                                className="w-full px-5 py-3.5 border rounded-md"
                                placeholder="Enter Your Address"
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            )}

                          </Grid>
                        }
                            <Grid item sm={12} md={12}>
                              <InputLabel>Zip Code</InputLabel>
                              <TextField
                                required
                                fullWidth
                                id="number"
                                name="postalCode"
                                type="number"
                                autoComplete="number"
                                autoFocus
                                placeholder="Zip code (optional)"
                                onChange={handleChange}
                              />
                            </Grid>
                          </Grid>
                        </form>
                      )}

                      {index === 1 && (
                        <form>
                          <Grid container spacing={1}>
                            <Grid item sm={12} md={12}>
                              <div className="lg:col-span-2 rounded-lg border-4 border-dashed w-full group text-center py-5">
                                <label>
                                  <div>
                                    <img
                                      className="w-20 h-20 mx-auto object-center cursor-pointer"
                                      src="https://i.ibb.co/GJcs8tx/upload.png"
                                      alt="upload image"
                                    />
                                    <p>Drag your images here </p>
                                    <p className="text-gray-600 text-xs">
                                      (Only *.jpeg, *.webp and *.png images will
                                      be accepted)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    name="images"
                                    multiple
                                    className="hidden"
                                    onChange={handleChange}
                                  />
                                </label>
                              </div>
                            </Grid>
                          </Grid>
                        </form>
                      )}

                      {index === 2 && (
                        <form>
                          <div className="flex justify-center gap-6 mt-12">
                            <Paper>
                              <Box
                                component="form"
                                sx={{
                                  "& .MuiTextField-root": {
                                    mt: 1,
                                  },
                                }}
                              >
                                <Grid container spacing={1}>
                                  <Grid item sm={12} md={12}>
                                    <InputLabel>First Name</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      name="firstName"
                                      autoComplete="firstName"
                                      type="text"
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                  <Grid item sm={12} md={12}>
                                    <InputLabel>Last Name</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      name="lastName"
                                      type="text"
                                      onChange={handleChange}
                                    />
                                  </Grid>

                                  <Grid item sm={12} md={6}>
                                    <InputLabel>City</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      name="userCity"
                                      type="text"
                                      placeholder="userCity"
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                  <Grid item sm={12} md={12}>
                                    <InputLabel>Address</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      id="address"
                                      name="address"
                                      autoComplete="address"
                                      autoFocus
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                  <Grid item sm={12} md={12}>
                                    <InputLabel>Zip Code</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      id="number"
                                      name="userPostalCode"
                                      type="number"
                                      autoComplete="userPostalCode"
                                      autoFocus
                                      placeholder="userPostalCode"
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                  <Grid item sm={12} md={12}>
                                    <InputLabel>Contact Number</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      id="phone"
                                      name="phone"
                                      type="tel"
                                      autoComplete="tel"
                                      autoFocus
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                  <Grid item sm={12} md={12}>
                                    <div>
                                      <img
                                        className="w-20 h-20 mx-auto object-center cursor-pointer"
                                        src="https://i.ibb.co/GJcs8tx/upload.png"
                                        alt="upload image"
                                      />
                                    </div>
                                    <input
                                      type="file"
                                      name="image"
                                      onChange={handleChange}
                                      className=""
                                    />
                                  </Grid>
                                </Grid>
                                {formData.type &&
                            formData.date &&
                            formData.bedroom &&
                            formData.bathroom &&
                            formData.size &&
                            formData.rent &&
                            cityName &&
                            address &&
                            images.length > 0 &&
                            formData.firstName &&
                            formData.lastName &&
                            formData.userCity &&
                            formData.phone &&
                            image ? (
                              <Button
                                type="submit"
                                fullWidth
                                onClick={handleSubmit}
                                variant="contained"
                                sx={{
                                  mt: 3,
                                  mb: 2,
                                }}
                              >
                                Submit
                              </Button>
                            ) : (
                              <button
                                disabled
                                className="bg-gray-300 w-full py-2 px-3 my-2"
                              >
                                Submit
                              </button>
                            )}
                              </Box>
                            </Paper>
                          </div>
                        </form>
                      )}
                      {/* Add other form fields here for other steps */}
                    </div>
                    <Box sx={{ mb: 2 }}>
                      <div>
                      <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      {index === 0 &&
                    formData.type &&
                    formData.date &&
                    formData.bedroom &&
                    formData.bathroom &&
                    formData.size &&
                    formData.rent &&
                    cityName &&
                    address && (
                      <Button onClick={handleNext1}>
                        {index === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    )}
                  {activeStep === 1 && images.length > 0 && (
                    <Button onClick={handleNext1}>
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  )}
                       
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Box>
        </div>
      </div>
      <div className="mx-auto">
        <div
          onClick={() => setOpenModal(false)}
          className={`fixed z-[100] flex items-center justify-center ${
            openModal ? "visible opacity-100" : "invisible opacity-0"
          } inset-0 bg-black/20 backdrop-blur-sm duration-100 dark:bg-transparent`}
        >
          <div
            onClick={(e_) => e_.stopPropagation()}
            className={`text- absolute max-w-screen-xl rounded-lg bg-white p-6 drop-shadow-lg ${
              openModal
                ? "scale-1 opacity-1 duration-300"
                : "scale-0 opacity-0 duration-150"
            }`}
          >
           <div className="flex justify-end mb-3">
           <button onClick={closeHandleModal} className=" rounded-md border border-rose-600 px-6 py-[6px] text-rose-600 duration-150 hover:bg-rose-600 hover:text-white">
                X
              </button>
           </div>
            <div className="w-72 md:max-w-[500px] lg:max-w-[700px] md:w-[700px]">{map}</div>
          </div>
        </div>
      </div>
    </>
  );
}
