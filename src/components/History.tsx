import { useEffect, useState } from "react";
import { getInvoces } from "../services/InvoiceService";
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import { printInvoice } from "../utils/print";

interface InvoiceRequest {
    idInvoice?: number;
    idUser: number;
    clientName: string;
    registerDate: string;
    productsInvoice: any
}

const History: React.FC = () => {

    const [invoiceList, setInvoiceList] = useState<InvoiceRequest[]>([]);

    useEffect(() => {
        return () => {
            getInvices();
        };
    }, []);

    const getInvices = async () => {

        const invoices = await getInvoces();
        if (invoices.error !== true)
            setInvoiceList(invoices.response);

    }

    const calculateTax = (amount: number, price: number, row: Product) => {
        if (row.tax === 0) {
            return 0;
        }
        var totalTax = amount * price * 0.13;
        row.totalTax = totalTax;
        return totalTax.toFixed(2);
    }

    return (
        <>

            <Container>
                <Typography variant="h4" gutterBottom>
                    Historial de Compras
                </Typography>
                {invoiceList.map((invoice: any) => (
                    <Paper key={invoice.idInvoice} style={{ marginBottom: 20, padding: 20 }}>
                        <Typography variant="h6"># Ticket: {invoice.idInvoice}</Typography>
                        <Typography variant="subtitle1">Nombre cliente: {invoice.clientName}</Typography>
                        <Typography variant="subtitle2">Fecha: {new Date(invoice.registerDate).toLocaleString()}</Typography>

                        <TableContainer component={Paper} style={{ marginTop: 20 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Codigo</TableCell>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>IVA</TableCell>
                                        <TableCell>Subtotal</TableCell>
                                        <TableCell>Total Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.productsInvoice.map((product: any) => (
                                        <TableRow key={product.idProduct}>
                                            <TableCell>{product.code}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.price}</TableCell>
                                            <TableCell>{product.amount}</TableCell>
                                            <TableCell>{product.totalTax}</TableCell>
                                            <TableCell>{product.subTotal}</TableCell>
                                            <TableCell>{product.totalPrice}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PrintIcon />}
                            style={{ marginTop: 20 }}
                            onClick={() => printInvoice(invoice.idInvoice, invoiceList)}
                        >
                            Imprimir
                        </Button>
                    </Paper>
                ))}
            </Container>
        </>
    );
}

export default History;
