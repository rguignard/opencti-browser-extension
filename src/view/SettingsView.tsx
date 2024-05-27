import * as React from 'react';
import Box from '@mui/material/Box';
import {
    Alert,
    Button,
    FormControl,
    InputLabel,
    LinearProgress,
    Paper,
    SelectChangeEvent,
    Stack,
    Select,
    TextField
} from '@mui/material';
import {Field, Form, Formik} from 'formik';
import {healthCheck} from "../QueryHelpers";
import MenuItem from "@mui/material/MenuItem";

function SettingsView(props: any) {

    const [validConnection, setValidConnection] = React.useState(0);

    const [initialValues, setInitialValues] = React.useState({
        url: '',
        token: '',
    })

    const [theme, setTheme] = React.useState<string>('light');

    const handleThemeChange = (event: SelectChangeEvent<unknown>) => {
        setTheme(event.target.value as string);
        props.setMode(event.target.value as string);
        chrome.storage.local.set({"theme": event.target.value as string}, function () {});
    };

    React.useEffect(() => {
        chrome.storage.local.get(["opencti_url", "opencti_token"], function (result) {
            setInitialValues({
                url: (result.opencti_url === undefined) ? "" : result.opencti_url,
                token: (result.opencti_token === undefined) ? "" : result.opencti_token
            })
        });
        chrome.storage.local.get(["theme"], function (result) {
            let theme = result.theme;
            if (theme === 'undefined'){
                theme = 'light'
            }
            theme ??= 'light'
            setTheme(theme);
            props.setMode(theme);
        });
    }, []);

    return (
        <Stack sx={{width: '100%', p: 2}} spacing={2}>
            <Paper elevation={0}>
                <h3>Connection settings</h3>
                {(function () {
                    switch (validConnection) {
                        case 1:
                            return <Alert severity="success">Connection succeeded</Alert>
                        case 2:
                            return <Alert severity="error">Failed to connect, please verify your settings</Alert>
                        default:
                            return null;
                    }
                })()}

                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    onSubmit={(values, {setSubmitting}) => {
                        setValidConnection(0);
                        setSubmitting(false);
                        setTimeout(async () => {
                            try {
                                await healthCheck(values.url, values.token);
                                setValidConnection(1);
                                chrome.storage.local.set({"opencti_url": values.url}, function () {
                                });
                                chrome.storage.local.set({"opencti_token": values.token}, function () {
                                });
                                props.setIsConfigured(true);
                            } catch (err) {
                                console.log(err);
                                setValidConnection(2);
                            }
                        }, 500);
                    }}
                >
                    {({
                          isSubmitting,
                      }) => (
                        <Form>
                            <Field
                                as={TextField}
                                fullWidth
                                sx={{mt: 2}}
                                id="url"
                                name="url"
                                variant="standard"
                                label="OpenCTI URL"
                                margin="dense"
                            />
                            <br/>
                            <Field
                                as={TextField}
                                fullWidth
                                sx={{mt: 2}}
                                id="token"
                                name="token"
                                variant="standard"
                                label="OpenCTI Token"
                                margin="dense"
                            />
                            {isSubmitting && <LinearProgress/>}
                            <br/>
                            <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="medium"
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Paper>
            <Paper elevation={0}>
                <h3>User experience</h3>
                <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                        variant="standard"
                        label="Theme"
                        size="small"
                        value={theme}
                        onChange={handleThemeChange}
                    >
                        <MenuItem value={'light'}>Light</MenuItem>
                        <MenuItem value={'dark'}>Dark</MenuItem>
                    </Select>
                </FormControl>
            </Paper>
        </Stack>
    );
}

export default SettingsView;
