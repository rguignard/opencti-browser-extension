import * as React from 'react';
import {entityToPath, getStorage} from "../Utils"
import {searchIndicator, searchVulnerability} from "../QueryHelpers"
import {
    AccordionActions,
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider, Drawer,
    IconButton,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow, Tooltip,
    Typography
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useDomEvaluator from '../hooks/useDOMEvaluator';
import {GetPageContent, MessageTypes} from "../chromeServices/types";
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import Link from '@mui/material/Link';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
import browser from "webextension-polyfill";

function HomeView(props: any) {

    const [observables, setObservables] = React.useState<any[]>([]);
    const [noObservablesFound, setNoObservablesFound] = React.useState(false);
    const [copy, setCopy] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const {evaluate: getPageContent} = useDomEvaluator<GetPageContent>(
        MessageTypes.GET_CONTENT,
    );

    function process(content: any) {
        getStorage().then((storage: any) => {
            setNoObservablesFound(false);
            let items = content['items'];
            setObservables(items);
            props.setObservables(items);
            props.setContent(content);
            if (items && items.length > 0) {
                items.forEach((item: any) => searchObservable(item, storage));
            } else {
                setNoObservablesFound(true);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    React.useEffect(() => {
        const fetchData = async () => new Promise<any[]>(async (resolve, reject) => {
            const content = await getPageContent();
            if (content) {
                process(content);
            }
        });

        fetchData().then().catch((err) => console.log(err));

        browser.tabs.onActivated.addListener(function (activeInfo) {
            fetchData().then().catch((err) => console.log(err));
        });

        browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete') {
                fetchData().then().catch((err) => console.log(err));
            }
        })
    }, []);

    function updateObservableState(item: any) {
        const nextCounters = observables.map((counter) => {
            if (counter['value'] === item['value']) {
                return item
            } else {
                return counter;
            }
        });
        setObservables(observables => [...observables, ...nextCounters]);
    }

    const handleCopyToClipboard = () => {
        setCopy(true);
        console.log(observables);
        let textObservables = observables.map((item) => {
            return item.value;
        }).join('\n');
        navigator.clipboard.writeText(textObservables).then();
    }

    const highlightObservables = () => {
        //highLight(observables);
        chrome.tabs.query(
            {
                active: true,
                currentWindow: true,
            },
            (tabs) => {
                chrome.tabs.sendMessage(
                    tabs[0].id || 0,
                    {
                        type: "highlight",
                        param: {"tabId": tabs[0].id || 0, "observables": observables}
                    }).then();
            },
        );
    }

    function processSTIXRelations(observable: any, nodeSTIXRelations: any, storage: any) {
        for (const relation of nodeSTIXRelations) {
            if (relation['node']['to'].hasOwnProperty('entity_type')) {
                let relationId = relation['node']['to']['id'];
                observable['associations'].push({
                    entity_type: relation['node']['to']['entity_type'],
                    id: relationId,
                    name: relation['node']['to']['name'],
                    link: storage['opencti_url'] + entityToPath(relation['node']['to']['entity_type']) + '/' + relationId
                });
            }
        }
        return observable;
    }

    function processReportsRelations(observable: any, nodeReports: any, storage: any) {
        for (const report of nodeReports) {
            let reportId = report['node']['id'];
            observable['associations'].push({
                entity_type: 'report',
                id: reportId,
                name: report['node']['name'],
                link: storage['opencti_url'] + entityToPath('report') + '/' + reportId
            });
        }
        return observable;
    }

    async function searchObservable(observable: any, storage: any) {
        if (observable["type"] === "vulnerability") {
            let result = await searchVulnerability(observable, storage);
            observable["state"] = "processed";
            observable["status"] = {};
            if (result["data"]["vulnerabilities"]["edges"].length === 0) {
                observable["status"] = {value: "N/A", code: "not_found"};
            } else {
                observable['status'] = {value: 'Found', code: 'found'};
                let vulnerability_id = result['data']['vulnerabilities']['edges'][0]['node']['id'];
                observable['link'] = storage['opencti_url'] + entityToPath('vulnerability') + '/' + vulnerability_id;
                observable['labels'] = [];
                let labels = result['data']['vulnerabilities']['edges'][0]['node']['objectLabel'];
                for (const label of labels) {
                    observable['labels'].push(label['value']);
                }
                observable['associations'] = [];
                let nodeReports = result['data']['vulnerabilities']['edges'][0]['node']['reports']['edges'];
                observable = processReportsRelations(observable, nodeReports, storage);
                let nodeSTIXRelations = result['data']['vulnerabilities']['edges'][0]['node']['stixCoreRelationships']['edges'];
                observable = processSTIXRelations(observable, nodeSTIXRelations, storage);
            }
        } else {
            let result = await searchIndicator(observable, storage);
            observable['state'] = "processed";
            observable['status'] = {};

            if (result['data']['indicators']['edges'].length === 0) {
                observable['status'] = {value: "N/A", code: "not_found"};
            } else {
                let indic_score = result['data']['indicators']['edges'][0]['node']['x_opencti_score'];
                let indic_id = result['data']['indicators']['edges'][0]['node']['id'];
                observable['status']['value'] = indic_score + "/100";
                observable['link'] = storage['opencti_url'] + entityToPath('indicator') + '/' + indic_id;
                if (indic_score === 0) {
                    observable['status']['code'] = "benign";
                } else if (indic_score > 0 && indic_score < 60) {
                    observable['status']['code'] = "suspicious";
                } else {
                    observable['status']['code'] = "malicious";
                }
                observable['labels'] = [];
                let labels = result['data']['indicators']['edges'][0]['node']['objectLabel'];
                for (const label of labels) {
                    observable['labels'].push(label['value']);
                }
                observable['associations'] = [];
                let nodeReports = result['data']['indicators']['edges'][0]['node']['reports']['edges'];
                observable = processReportsRelations(observable, nodeReports, storage);
                let nodeSTIXRelations = result['data']['indicators']['edges'][0]['node']['stixCoreRelationships']['edges'];
                observable = processSTIXRelations(observable, nodeSTIXRelations, storage);
            }
        }
        updateObservableState(observable);
    }

    function renderObservableAssociationTable(observable: any) {
        const relations = observable.associations;
        if (relations.length > 0) {
            return (
                <TableContainer>
                    <Table>
                        <TableBody>
                            {relations.map((row: any) => (
                                <TableRow
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell sx={{width: "10%"}} component="th" scope="row">
                                        <Chip sx={{borderRadius: 0}} label={row?.entity_type?.toUpperCase()}
                                              className={`bg-icon bg-${row?.entity_type?.toLowerCase()}`}/>
                                    </TableCell>
                                    <TableCell>
                                        <Link sx={{textDecoration: "none"}} href={row.link} rel="noreferrer" target="_blank">{row.name}</Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        } else {
            return (
                <Typography sx={{p: 1}} variant="body2">No relations found</Typography>
            )
        }
    }

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    function renderDrawer(){
        return (
            <Drawer
                anchor="bottom"
                open={open}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        height: '50%'
                    },
                }}
            >
                    <Typography
                        sx={{
                            pt: 0.5,
                            position: 'absolute',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 'fill-available',
                            marginRight: '40px'
                        }}
                        variant="body2">"héhéhé"
                    </Typography>
            </Drawer>
        )
    }

    function renderAccordion(observable: any) {
        if (observable.state === 'pending') {
            return (
                <Accordion square={true} disabled>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                    >
                        <Stack direction="row" sx={{display: 'flex', width: '100%'}} spacing={2}>
                            <CircularProgress size={25}/>
                            <Box sx={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                <Typography
                                    sx={{
                                        pt: 0.5,
                                        position: 'absolute',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: 'fill-available',
                                        marginRight: '40px'
                                    }}
                                    variant="body2">{observable.value}
                                </Typography>
                            </Box>
                        </Stack>
                    </AccordionSummary>
                </Accordion>
            )
        } else if (observable.state === 'processed' && observable.status['code'] === "not_found") {
            return (
                <Accordion square={true}>
                    <AccordionSummary>
                        <Stack direction="row" sx={{display: 'flex', width: '100%'}} spacing={2}>
                            <Chip sx={{borderRadius: 0}} label={observable.status.value}
                                  className={`status-badge ${observable.status.code}`} variant="filled" size="small"/>
                            <Box sx={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                <Typography
                                    sx={{
                                        pt: 0.5,
                                        position: 'absolute',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: 'fill-available',
                                        marginRight: '40px'
                                    }}
                                    variant="body2">{observable.value}
                                </Typography>
                            </Box>
                        </Stack>
                    </AccordionSummary>
                </Accordion>
            )
        } else {
            return (
                <Accordion defaultExpanded square={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}>
                        <Stack direction="row" sx={{display: 'flex', width: '100%'}} spacing={2}>
                            <Chip sx={{borderRadius: 0}} label={observable.status.value}
                                  className={`status-badge ${observable.status.code}`} variant="filled" size="small"/>
                            <Box sx={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                <Typography
                                    sx={{
                                        pt: 0.5,
                                        position: 'absolute',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: 'fill-available',
                                        marginRight: '40px'
                                    }}
                                    variant="body2">{observable.value}
                                </Typography>
                            </Box>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1} sx={{pb: 2}}>
                            {observable.labels && observable.labels.map((value: string) => {
                                return (
                                    <Chip sx={{borderRadius: "0"}} size="small" label={value} color="secondary" variant="outlined"/>
                                )
                            })}
                        </Stack>
                        <Divider textAlign="left">KNOWLEDGE</Divider>
                        {renderObservableAssociationTable(observable)}
                        <Divider textAlign="left"></Divider>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button target="_blank" href={observable.link} sx={{color: "rgb(216, 27, 96)"}} size="small"
                                startIcon={<OpenInNewRoundedIcon/>}>
                            View in OpenCTI
                        </Button>
                        {/* <Button startIcon={<DeleteOutline/>} onClick={toggleDrawer(true)}></Button>*/}
                    </AccordionActions>
                </Accordion>
            )
        }
    }

    if (noObservablesFound) {
        return (
            <Stack sx={{width: '100%', p: 2}}>
                <Alert sx={{p: 2}} severity="info">No observables found on page</Alert>
            </Stack>
        )
    } else {
        return (

            <div>
                {observables && (
                    <Box sx={{p: 1}}>
                        <Stack direction="row" sx={{display: 'flex', width: '100%', textAlign: 'right'}} spacing={2}>
                            <Tooltip title="Copy to clipboard">
                                <IconButton>
                                    <CopyAllOutlinedIcon color={"info"} onClick={handleCopyToClipboard}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Highlight observables">
                                <IconButton>
                                    <AutoFixHighOutlinedIcon color={"info"} onClick={highlightObservables} />
                                </IconButton>
                            </Tooltip>
                            <Snackbar
                                open={copy}
                                onClose={() => setCopy(false)}
                                autoHideDuration={2000}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right"
                                }}
                                message="Copied to clipboard"
                            />
                        </Stack>
                    </Box>
                )}

                {observables && observables.map((observable) => {
                    return (
                        <Box sx={{maxWidth: '100%'}}>
                            {renderAccordion(observable)}
                        </Box>
                    );
                })}
                {renderDrawer()}
            </div>
        )
    }
}

export default HomeView;
