import React from 'react';
import './App.css';
import HomeView from "./view/HomeView";
import SettingsView from "./view/SettingsView";
import {
    Alert,
    AppBar,
    Badge,
    Box,
    Button, createTheme,
    CssBaseline,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    styled, ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material';
import WorkbenchPublishView from "./view/WorkbenchPublishView";
import Logo from "./assets/logo-text.png";
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import CenterFocusWeakOutlinedIcon from '@mui/icons-material/CenterFocusWeakOutlined';
import SearchExploreView from "./view/SearchExploreView";
import {getStorage} from "./Utils";
import {getDesignTokens, getThemedComponents} from "./theme";
import { deepmerge } from '@mui/utils';

export enum View {
    Home,
    Settings,
    WorkbenchPublish = 2,
    SearchExplore = 3
}

function App() {

    const [view, setView] = React.useState<View>(View.Home);
    const [observables, setObservables] = React.useState<any[]>([]);
    const [content, setContent] = React.useState<any>();
    const [searchValue, setSearchValue] = React.useState<any>();
    const [configured, setIsConfigured] = React.useState(false);
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');
    const theme = React.useMemo(() => createTheme(deepmerge(getDesignTokens(mode), getThemedComponents(mode))), [mode]);


    React.useEffect(() => {
        getStorage().then((storage: any) => {
            if (storage.hasOwnProperty("opencti_url") && storage.hasOwnProperty("opencti_token")) {
                setIsConfigured(true);
            }
            setMode(storage.theme ??= 'light');
            const queryParameters = new URLSearchParams(window.location.search);
            if (queryParameters.has("action")) {
                if (queryParameters.get("action") === "search") {
                    setSearchValue(queryParameters.get("query"));
                    setView(View.SearchExplore);
                }
            }
        });
    }, []);


    const renderView = () => {
        switch (view) {
            case View.Home:
                return <HomeView setView={setView} setContent={setContent} setObservables={setObservables}/>
            case View.Settings:
                return <SettingsView setView={setView} setIsConfigured={setIsConfigured} setMode={setMode}/>
            case View.WorkbenchPublish:
                return <WorkbenchPublishView setView={setView} content={content} observables={observables}/>
            case View.SearchExplore:
                return <SearchExploreView setView={setView} searchValue={searchValue}/>
            default:
                return <HomeView setView={setView}/>
        }
    }

    const DrawerHeader = styled('div')(({theme}) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    }));

    const drawerWidth = 65;

    return (
        /*<ColorModeContext.Provider value={colorMode}>*/
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    <Box>
                    <AppBar position="fixed" sx={{bgcolor: '#070d19', boxShadow: 'none', backgroundImage: 'none'}}>
                        <Toolbar variant='regular' disableGutters={true} sx={{minHeight: 56, height: 56}}>
                            <Box
                                component="img"
                                sx={{
                                    height: 35,
                                    paddingLeft: 1,
                                }}
                                alt="OpenCTI"
                                src={Logo}/>
                            <Typography variant="h6" noWrap component="div" sx={{pl: 2, color: 'rgb(255, 255, 255)'}}>
                                Threat Crawler
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Box component="main"
                         sx={{
                             width: `calc(100% - ${drawerWidth}px)`
                         }}>
                        <DrawerHeader/>
                        {(function() {
                            if (!configured && view !== View.Settings) {
                                return (
                                    <Box sx={{p: 2}}>
                                        <Alert severity="warning">
                                            <Typography variant="body2" gutterBottom>
                                                To get started, please configure the extension by setting the OpenCTI instance URL and token
                                                to use
                                            </Typography>
                                            <Button
                                                sx={{pt: 1}}
                                                variant="text"
                                                size="small"
                                                color="secondary"
                                                onClick={() => setView(View.Settings)}>
                                                Configure

                                            </Button>
                                        </Alert>
                                    </Box>
                                );
                            } else {
                                return (renderView());
                            }
                        })()}
                    </Box>
                    <Drawer
                        variant="permanent"
                        anchor="right"
                        sx={{
                            width: `${drawerWidth}`,
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: {top: '56px', width: 'auto', boxSizing: 'border-box'},
                        }}>
                        <Toolbar/>
                        <Box sx={{overflow: 'auto'}}>
                            <List>
                                <ListItem disablePadding sx={{display: 'block'}}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: 'center',
                                            px: 2.5,
                                        }}
                                        onClick={() => setView(View.Home)}>
                                        <Badge badgeContent={observables.length} color="secondary">
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: 'auto',
                                                    justifyContent: 'center',
                                                }}>
                                                <CenterFocusWeakOutlinedIcon color={"secondary"}/>
                                            </ListItemIcon>
                                        </Badge>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding sx={{display: 'block'}}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: 'center',
                                            px: 2.5,
                                        }}
                                        onClick={() => setView(View.WorkbenchPublish)}>
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: 'auto',
                                                justifyContent: 'center',
                                            }}>
                                            <PublishedWithChangesOutlinedIcon color={"secondary"}/>
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                                <Divider/>
                                <ListItem disablePadding sx={{display: 'block'}}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: 'center',
                                            px: 2.5,
                                        }}
                                        onClick={() => setView(View.SearchExplore)}>
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: 'auto',
                                                justifyContent: 'center',
                                            }}>
                                            <TravelExploreOutlinedIcon color={"secondary"}/>
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                                <Divider/>
                                <ListItem disablePadding sx={{display: 'block'}}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: 'center',
                                            px: 2.5,
                                        }}
                                        onClick={() => setView(View.Settings)}>
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: 'auto',
                                                justifyContent: 'center',
                                            }}>
                                            <SettingsOutlinedIcon color={"secondary"}/>
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Box>
                    </Drawer>
                </Box>
                </div>
            </ThemeProvider>
        /*</ColorModeContext.Provider>*/
    );
}

export default App;
