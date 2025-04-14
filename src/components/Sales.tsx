import { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import useFormValidation from '../hooks/useFormValidation';
import { validateRequired } from '../validators/formValidators';
import { getProductByCode } from '../services/productService';
import { showErrorAlert, showSuccessAlert } from '../utils/sweetAlertUtils';
import { Delete, Edit } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { createInvoice } from '../services/InvoiceService';
import { getActualDate } from '../utils/dates';

interface Product {
    idProduct: number,
    code: string,
    name: string,
    price: number,
    tax: number,
    details: string,
    totalPrice: number,
    amount?: number,
    subTotal?: number,
    totalTax?: number
}

const Sales: React.FC = () => {

    const [productFinded, setProductFinded] = useState<Product>({
        idProduct: 0,
        code: '',
        name: '',
        price: 0,
        tax: 0,
        details: '',
        totalPrice: 0,
        amount: 0
    });

    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [productList, setProductList] = useState<Product[]>([]);

    const { valuesForm, setValuesForm, errorsForm, handleChange, validate } = useFormValidation(
        { code: '', name: '', amount: 1 },
        { code: validateRequired, name: validateRequired, amount: validateRequired }
    );

    useEffect(() => {
        let productSesion = sessionStorage.getItem('products');

        if (productSesion && productList.length === 0) {
            let jsonProduct = JSON.parse(productSesion);
            setProductList(jsonProduct);
        }
    }, []);

    useEffect(() => {
        if (productList.length !== 0) {
            sessionStorage.setItem('products', JSON.stringify(productList));
        }
    }, [productList]);

    const addProduct = () => {

        if (parseInt(valuesForm.amount.toString()) <= 0) {
            showErrorAlert({ text: 'Cantidad no valido' });
        } else if (validate()) {

            const existProduct = productList.filter((prod: Product) => prod.code === valuesForm.code);

            if (existProduct.length > 0) {

                let sumAmountProd: number = existProduct.reduce((sum, prod) => {
                    const amount = prod.amount ?? 0;
                    return sum + amount + parseInt(valuesForm.amount.toString());
                }, 0);

                if (isUpdate) {
                    sumAmountProd = parseInt(valuesForm.amount.toString());
                }

                const removeProduct = productList.filter((prod: Product) => prod.code !== valuesForm.code);
                existProduct[0].amount = sumAmountProd;

                let valueTax = 0;
                if (existProduct[0].tax)
                    valueTax = 13;

                const price = existProduct[0].price;
                const subtotal = price * sumAmountProd;
                const taxAmount = subtotal * (valueTax / 100);

                const totalPrice = subtotal + taxAmount;

                existProduct[0].totalPrice = totalPrice;

                removeProduct.push(existProduct[0])

                setProductList(removeProduct);
                setValuesForm({
                    code: "",
                    name: "",
                    amount: 0,
                })

            } else {
                const updatedProduct = {
                    ...productFinded,
                    amount: parseInt(valuesForm.amount.toString())
                };

                setProductList(prevItems => [...prevItems, updatedProduct]);
                setValuesForm({
                    code: "",
                    name: "",
                    amount: 0,
                })

            }

        }

        setIsUpdate(false);
    }

    const findProductByCode = async () => {

        if (valuesForm.code !== "") {
            const response = await getProductByCode(valuesForm.code.toString());

            if (response.response !== null) {
                setProductFinded(response.response);
                setValuesForm({
                    code: response.response.code,
                    name: response.response.name,
                    amount: valuesForm.amount,
                })
            } else {
                setValuesForm({
                    code: valuesForm.code,
                    name: "",
                    amount: 0,
                })
            }

        }

    }

    const setEditProduct = (product: Product) => {

        setIsUpdate(true);
        const amountTemp: number = parseInt(product.amount ? product.amount.toString() : '0');

        setValuesForm({
            code: product.code,
            name: product.name,
            amount: amountTemp,
        })

    }

    const setDeleteProduct = (product: Product) => {
        const deleted = productList.filter((prod: Product) => prod.idProduct != product.idProduct);
        setProductList(deleted);
        sessionStorage.setItem('products', JSON.stringify(deleted));
    }

    const addInvoice = async () => {

        const { value: clientName } = await Swal.fire({
            title: "Ingrese el nombre del cliente",
            input: "text",
            inputLabel: "Ingrese el nombre exacto",
            inputPlaceholder: "Nombre cliente",
            confirmButtonText: 'Pagar'
        });

        if (clientName) {

            var idUserSesion: string | null = sessionStorage.getItem('idUser');
            if (idUserSesion !== null) {

                const response = await createInvoice({
                    clientName: clientName,
                    idUser: parseInt(idUserSesion),
                    registerDate: getActualDate(),
                    productsInvoice: productList
                })

                if (response.error === true) {
                    showErrorAlert({ text: response.message });
                } else {
                    clearInvoice();
                    showSuccessAlert({ text: response.message });
                }

            }

        }

    }

    const caculateTotal = (): number => {
        let total = 0;
        productList.map((prod: Product) => total = total + prod.totalPrice)
        return total;
    }

    const calculateSubTotal = (price: number, amount: number, product: Product) => {
        product.subTotal = price * amount;
        return (price * amount).toFixed(2)
    };

    const calculateTax = (amount: number, price: number, row: Product) => {
        if (row.tax === 0) {
            return 0;
        }
        var totalTax = amount * price * 0.13;
        row.totalTax = totalTax;
        return totalTax.toFixed(2);
    }

    const calculateTotal = (product: Product) => {
        let totalPrice = parseFloat(product.subTotal!.toString()) + parseFloat(product.totalTax!.toString());
        product.totalPrice = parseFloat(totalPrice.toFixed(2));
        return totalPrice.toFixed(2);
    }

    const clearInvoice = () => {
        setProductList([]);
        sessionStorage.removeItem('products');
    }

    return (
        <>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: '16px'
            }}>
                <TextField
                    id="code"
                    margin="normal"
                    required
                    label="Codigo"
                    style={{ flex: '1 1 auto', minWidth: '200px' }}
                    value={valuesForm.code}
                    onKeyUp={findProductByCode}
                    onChange={handleChange}
                    error={!!errorsForm.code}
                    helperText={errorsForm.code}
                />
                <TextField
                    disabled={true}
                    id="name"
                    margin="normal"
                    required
                    label="Nombre"
                    style={{ flex: '1 1 auto', minWidth: '200px' }}
                    value={valuesForm.name}
                    onChange={handleChange}
                    error={!!errorsForm.name}
                    helperText={errorsForm.name}
                />
                <TextField
                    id="amount"
                    margin="normal"
                    required
                    type='number'
                    label="Cantidad"
                    style={{ flex: '1 1 auto', minWidth: '200px' }}
                    value={valuesForm.amount}
                    onChange={handleChange}
                    error={!!errorsForm.amount}
                    helperText={errorsForm.amount}
                />
                <Button
                    sx={{ width: '200px', height: '50px' }}
                    type="button"
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={addProduct}
                >
                    Agregar
                </Button>
            </div>

            <Box
                component="form"
                sx={{ mt: 3 }}>
                {
                    productList.length === 0 ?
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <h3>No existen registros</h3>
                        </div>
                        :
                        <TableContainer sx={{ maxHeight: '400px' }} component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '700' }}>Codigo</TableCell>
                                        <TableCell sx={{ fontWeight: '700' }}>Nombre</TableCell>
                                        <TableCell sx={{ fontWeight: '700' }} align="center">Cantidad</TableCell>
                                        <TableCell sx={{ fontWeight: '700' }} align="right">Precio</TableCell>
                                        <TableCell sx={{ fontWeight: '700' }} align="right">IVA</TableCell>
                                        <TableCell sx={{ fontWeight: '700' }} align="left">SubTotal</TableCell>
                                        <TableCell sx={{ fontWeight: '700' }} align="left">Total</TableCell>
                                        <TableCell sx={{ fontWeight: '700' }} align="center">Editar</TableCell>
                                        <TableCell sx={{ fontWeight: '700' }} align="center">Eliminar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productList.map((row) => (
                                        <TableRow key={row.code} >
                                            <TableCell>{row.code}</TableCell>
                                            <TableCell align="left" >{row.name}</TableCell>
                                            <TableCell align="center">{row.amount}</TableCell>
                                            <TableCell align="right">{row.price.toFixed(2)}</TableCell>
                                            <TableCell align="right">
                                                {
                                                    calculateTax(parseInt(row.amount!.toString()), row.price, row)
                                                }
                                            </TableCell>
                                            <TableCell align="left">
                                                {calculateSubTotal(row.price, parseInt(row.amount!.toString()), row)}
                                            </TableCell>
                                            <TableCell align="left">
                                                {calculateTotal(row)}
                                            </TableCell>
                                            <TableCell align="center" >
                                                <Button onClick={() => setEditProduct(row)}>
                                                    <Edit />
                                                </Button>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button onClick={() => setDeleteProduct(row)}>
                                                    <Delete color="error" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }

                <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}>
                    <h3>Total a pagar: {caculateTotal()}</h3>
                </div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'right', marginTop: '20px' }}>
                    <Button
                        sx={{ width: '200px', height: '50px' }}
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={addInvoice}
                    >
                        Pagar
                    </Button>
                    <Button
                        sx={{ width: '200px', height: '50px', marginLeft: '10px' }}
                        type="button"
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={clearInvoice}
                    >
                        Cancelar
                    </Button>
                </div>

            </Box>
        </>
    );
}

export default Sales;
