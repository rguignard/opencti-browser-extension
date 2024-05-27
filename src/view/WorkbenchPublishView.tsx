import * as React from 'react';
import { getStorage } from "../Utils"
import { DataGrid, GridColDef} from '@mui/x-data-grid';
import SendIcon from '@mui/icons-material/Send';
import {
    Alert, Autocomplete,
    Button, Chip, Divider,
    Paper,
    Stack,
    TextField, Typography
} from '@mui/material';
import {useState} from "react";
import {createWorkbench} from "../QueryHelpers";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";


function WorkbenchPublishView(props: any) {

    const [config, setConfig] = React.useState<any>();
    const [notConfigured, setNotConfigured] = React.useState(false);
    const [publishState, setPublishState] = React.useState(0);
    const [workbenchURL, setWorkbenchURL] = React.useState<string>('');
    const [workbenchName, setWorkbenchName] = useState(props.content.title);
    const [workbenchLabels, setWorkbenchLabels] = useState('');
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [error, setError] = useState('');

    const columns: GridColDef[] = [
        { field: 'type', headerName: 'Type', width: 80},
        { field: 'value', headerName: 'Value', flex: 1}
    ];

    const rows: any[] = props.observables;

    const handleCreateWorkbench = () => {
        let workbenchData = {
            name: workbenchName,
            from_url: props.content.url,
            labels: workbenchLabels,
            entities: selectedItems
        }
        createWorkbench(workbenchData, config)
            .then((result) => {
                if (result.hasOwnProperty("errors")){
                    setPublishState(2);
                    setError(result['errors'][0]['message']);
                }
                else {
                    setPublishState(1);
                    let encodedWorkbenchUploadPending = btoa(result['data']['uploadPending']['id'])
                    setWorkbenchURL(config['opencti_url']+"/dashboard/data/import/pending/"+encodedWorkbenchUploadPending);
                }
            })
            .catch((err) => {
                console.log(err);
                setPublishState(2);
            });
    }

    const handleLabelsChange = (event: any, value: any) => setWorkbenchLabels(value);

    const onRowsSelectionHandler = (ids: any[]) => {
        const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
        setSelectedItems(selectedRowsData);
    };

    React.useEffect(() => {
        getStorage().then((storage: any) => {
            if (storage.hasOwnProperty("opencti_url") && storage.hasOwnProperty("opencti_token")){
                setConfig(storage);
            }
            else {
                setNotConfigured(true);
            }
            }).catch((err) => {
                setNotConfigured(true);
                console.log(err);
            });
    }, []);

    if (notConfigured) {
        return (
            <Stack sx={{ width: '100%', p: 2}}>
                <Alert severity="warning">To get started, please configure the extension by setting the OpenCTI instance URL and token to use</Alert>
            </Stack>
        )
    }

    else {
        return (
            <Stack sx={{ width: '100%', p: 2}}>
                <Stack sx={{pb: 3}} >
                    {(function() {
                        switch (publishState) {
                            case 1:
                                return <Alert
                                    severity="success"
                                    action={
                                        <Button color="inherit" size="small" startIcon={<OpenInNewRoundedIcon />} target="_blank" href={workbenchURL}>
                                            View in OpenCTI
                                        </Button>
                                    }
                                >
                                    Workbench successfully created
                                </Alert>
                            case 2:
                                return <Alert severity="error">An error occurred: {error}</Alert>
                        }
                    })()}
                </Stack>
                <Paper elevation={0}
                    component="form"
                    sx={{ pb: 3, display: 'flex', alignItems: 'center', width: '100%' }}
                >
                    <TextField
                        sx={{ width: '100%'}}
                        id="standard-basic"
                        label="Workbench Name"
                        color="primary"
                        variant="standard"
                        size="small"
                        value={workbenchName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setWorkbenchName(event.target.value);
                        }}
                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <Button
                        disabled={selectedItems.length === 0 || workbenchName.length === 0}
                        variant="contained"
                        size="large"
                        endIcon={<SendIcon />}
                        onClick={handleCreateWorkbench}
                    >
                        Publish
                    </Button>

                </Paper>
                <Autocomplete
                    sx={{pb: 3}}
                    clearIcon={true}
                    options={[]}
                    freeSolo
                    multiple
                    onChange={handleLabelsChange}
                    renderTags={(value, props) =>
                        value.map((option, index) => (
                            <Chip label={option} {...props({ index })} />
                        ))
                    }
                    renderInput={(params) => <TextField color="primary" value={workbenchName} variant="standard" label="Labels to apply to entities" {...params}
                    />}
                />
                <Typography sx={{pb: 2, fontWeight: 600}} variant="subtitle2" component="h2">
                    Entities to import ({selectedItems?.length})
                </Typography>
                <Paper elevation={0}>
                    <DataGrid
                        sx={{
                            '.MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 'bold !important',
                                overflow: 'visible !important'
                            },
                            boxShadow: 0,
                        }}
                        rows={rows}
                        hideFooter={true}
                        columns={columns}
                        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                        checkboxSelection
                    />
                </Paper>
            </Stack>
        )
    }
}

export default WorkbenchPublishView;
