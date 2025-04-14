import { useEffect, useState } from 'react';
import useFormValidation from '../hooks/useFormValidation';
import { validateRequired } from '../validators/formValidators';
import Swal from 'sweetalert2';
import { Delete, Edit } from '@mui/icons-material';
import { createProduct, deleteProduct, editProduct, getProducts } from '../services/productService';

import { Box, Button, CardContent, Checkbox, FormControlLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { showErrorAlert, showSuccessAlert } from '../utils/sweetAlertUtils';

interface Product {
    idProduct: number,
    code: string,
    name: string,
    price: number,
    tax: number,
    details: string,
    totalPrice: number
}

const Products: React.FC = () => {

    const [disableButtonAdd, setdisableButtonAdd] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

    const [productList, setProductList] = useState<Product[]>([]);
    const [checkBoxValue, setChekboxValue] = useState<boolean>(true);

    useEffect(() => {
        getProductsApi();
    }, []);

    const getProductsApi = async () => {
        const response = await getProducts();
        setProductList(response.response);
    }

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { valuesForm, setValuesForm, errorsForm, handleChange, validate } = useFormValidation(
        { idProduct: 0, code: '', name: '', price: 0.00, details: '', totalPrice: 0 },
        { idProduct: validateRequired, code: validateRequired, name: validateRequired, price: validateRequired, details: validateRequired, totalPrice: validateRequired }
    );

    const addProduct = async () => {


        if (validate()) {

            setdisableButtonAdd(true);

            try {

                if (valuesForm.idProduct === 0) {
                    const result = await createProduct({
                        tax: checkBoxValue ? 1 : 0,
                        name: valuesForm.name.toString(),
                        details: valuesForm.details.toString(),
                        code: valuesForm.code.toString(),
                        price: parseFloat(parseFloat(valuesForm.price.toString()).toFixed(2)),
                        totalPrice: 0
                    });

                    if (result.error === false) {
                        getProductsApi();
                        setValuesForm({
                            idProduct: 0,
                            code: "",
                            name: "",
                            price: "",
                            details: ""
                        });
                        setdisableButtonAdd(false);
                        showSuccessAlert({ text: result.message });
                    } else {
                        setdisableButtonAdd(false);
                        showErrorAlert({ text: result.message });
                    }
                } else {
                    const result = await editProduct({
                        idProduct: parseInt(valuesForm.idProduct.toString()),
                        tax: checkBoxValue ? 1 : 0,
                        name: valuesForm.name.toString(),
                        details: valuesForm.details.toString(),
                        code: valuesForm.code.toString(),
                        price: parseFloat(parseFloat(valuesForm.price.toString()).toFixed(2)),
                        totalPrice: 0
                    });

                    if (result.error === false) {
                        getProductsApi();
                        setValuesForm({
                            idProduct: 0,
                            code: "",
                            name: "",
                            price: "",
                            details: ""
                        });
                        setdisableButtonAdd(false);
                        showSuccessAlert({ text: result.message });
                    } else {
                        setdisableButtonAdd(false);
                        showErrorAlert({ text: result.message });
                    }
                }


            } catch (error) {
                setdisableButtonAdd(false);
            }

        }
    }

    const setEditProduct = (item: Product) => {
        setChekboxValue(item.tax === 1 ? true : false);
        setValuesForm({
            code: item.code,
            idProduct: item.idProduct,
            name: item.name,
            details: item.details,
            price: parseFloat(item.price.toString()).toFixed(2),
            totalPrice: item.totalPrice
        });
    }

    const setDeleteProduct = (item: Product) => {

        Swal.fire({
            title: `Eliminar producto ${item.name}?`,
            showCancelButton: true,
            confirmButtonText: "Eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteProduct(item.code);

                if (response.error === false) {
                    getProductsApi();
                    showSuccessAlert({ text: response.message });
                } else {
                    showErrorAlert({ text: response.message });
                }


            }
        });
    };

    const handleCheckboxChange = (event: any) => {
        setChekboxValue(event.target.checked);
    };

    const calculateTaxProduct = (product: Product) => {
        return product.tax ? (product.price * 13 / 100).toFixed(2) : 0;
    }

    return (
        <CardContent sx={{
            overflow: 'auto',
            flexDirection: isMobile ? 'column' : 'row',
            display: 'flex',
            width: '100%',
            pl: 0, pr: 0
        }}>
            <input hidden type="text" value={valuesForm.idProduct} />
            <Box
                style={{ padding: '0px' }}
                component="form"
                sx={{
                    mt: 1,
                    width: isMobile ? '100%' : '40%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    px: 2
                }}>
                <TextField
                    id="code"
                    margin="normal"
                    required
                    label="Codigo"
                    value={valuesForm.code}
                    onChange={handleChange}
                    error={!!errorsForm.code}
                    helperText={errorsForm.code}
                />

                <TextField
                    id="name"
                    margin="normal"
                    required
                    label="Nombre"
                    value={valuesForm.name}
                    onChange={handleChange}
                    error={!!errorsForm.name}
                    helperText={errorsForm.name}
                />

                <TextField
                    id="details"
                    margin="normal"
                    required
                    label="Detalles"
                    value={valuesForm.details}
                    onChange={handleChange}
                />

                <TextField
                    id="price"
                    margin="normal"
                    required
                    label="Precio"
                    type='number'
                    value={valuesForm.price.toString()}
                    onChange={handleChange}
                    error={!!errorsForm.price}
                    helperText={errorsForm.price}
                    inputProps={{
                        step: "0.00",
                        min: "0"
                    }}
                />

                <FormControlLabel control={
                    <Checkbox
                        onChange={handleCheckboxChange}
                        checked={checkBoxValue}
                    />} label="Aplica IVA (13%)" />

                <Button
                    disabled={disableButtonAdd}
                    type="button"
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={addProduct}
                >
                    Guardar
                </Button>
            </Box>
            <Box
                component="form"
                sx={{
                    mt: 3,
                    width: isMobile ? '100%' : '60%',
                    padding: isMobile ? '0px' : '10px'
                }}>
                {
                    productList === null ?
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
                                        <TableCell sx={{ fontWeight: '700' }} align="right">Precio</TableCell>
                                        <TableCell sx={{ fontWeight: '700' }} align="right">IVA</TableCell>
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
                                            <TableCell align="right">{row.price.toFixed(2)}</TableCell>
                                            <TableCell align="right">
                                                {
                                                    calculateTaxProduct(row)
                                                }
                                            </TableCell>
                                            <TableCell align="left">{row.totalPrice.toFixed(2)}</TableCell>
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

            </Box>
        </CardContent>
    );
}

export default Products;
