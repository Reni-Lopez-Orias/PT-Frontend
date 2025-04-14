
export const printInvoice = (invoiceId: number, invoiceList: any) => {
    const invoice = invoiceList.find(inv => inv.idInvoice === invoiceId);

    if (!invoice) {
        console.error('Invoice not found!');
        return;
    }

    const totalInvoice = (product:any) => {
        let total = product.totalTax + product.totalPrice;
        return total.toFixed(2);
    }

    const printWindow = window.open('', '', '');
    printWindow.document.open();
    printWindow.document.write(`
        <html>
            <head>
                <title>#Ticket ${invoiceId}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        width: 250px; /* Ancho típico de un ticket */
                        font-size: 12px; /* Tamaño de fuente más pequeño para un ticket */
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 5px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .header, .footer {
                        text-align: center;
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>#Ticket ${invoiceId}</h2>
                    <p>Fecha: ${new Date(invoice.registerDate).toLocaleString()}</p>
                    <p>Cliente: ${invoice.clientName}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cod</th>
                            <th>Cant</th>
                            <th>Precio</th>
                            <th>IVA</th>
                            <th>SubTotal</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.productsInvoice.map(product => `
                            <tr>
                                <td>${product.name}</td>
                                <td>${product.code}</td>
                                <td>${product.amount}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>${product.totalTax}</td>
                                <td>${product.totalPrice.toFixed(2)}</td>
                                <td>${totalInvoice(product)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer">
                    <p>Gracias por comprar!</p>
                </div>
                <script>
                    window.print();
                    window.close();
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
};