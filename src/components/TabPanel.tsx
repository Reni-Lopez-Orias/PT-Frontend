import * as React from 'react';
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Card, CardContent } from '@mui/material';
import Products from './Products';
import Sales from './Sales';
import History from './History';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const changeTab = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const TabPanel = () => {
    const [value, setValue] = useState(1);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Card >
            <CardContent sx={{ p: 0 }}>
                <Box>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Productos" {...changeTab(0)} />
                            <Tab label="Facturacion" {...changeTab(1)} />
                            <Tab label="Historial" {...changeTab(2)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <Products />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <Sales />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <History />
                    </CustomTabPanel>
                </Box>
            </CardContent>
        </Card>

    );
}