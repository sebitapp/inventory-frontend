"use client"
import { useEffect, useState } from "react";
import { DataTable } from '@/components/data-table'
import { getColumns } from './features/columns'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button'
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const Page = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState({ name: "", description: "" });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleDelete = async (item) => {
        if (!confirm(`Estás seguro de borrar la FV "${item.name}"?`)) return;

        try {
            await axiosInstance.delete(`/api/sales/${item.documentId}`);
            await fetchData();
            toast.success("FV borrada correctamente");
        } catch (error) {
            console.log("Error al borrar la FV:", error);
            toast.error("Error al borrar la FV");
        }
    }

    const columns = getColumns(
        filters,
        handleFilterChange,
        handleDelete);

    const buildQuery = () => {
        const query = new URLSearchParams();
        query.set("pagination[page]", page);
        query.set("pagination[pageSize]", pageSize);

        if (filters.invoice_number) {
            query.set("filters[invoice_number][$eqi]", filters.invoice_number);
        }
        if (filters.customer_name) {
            query.set("filters[customer_name][$containsi]", filters.customer_name);
        }
        if (filters.customer_phone) {
            query.set("filters[customer_phone][$eqi]", filters.customer_phone);
        }
        if (filters.customer_email) {
            query.set("filters[customer_email][$containsi]", filters.customer_email);
        }


        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // último día del mes actual
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        query.set("filters[date][$gte]", startOfMonth.toISOString());
        query.set("filters[date][$lte]", endOfMonth.toISOString());

        return query.toString();
    }

    const fetchData = () => {
        setLoading(true);
        axiosInstance
            .get(`/api/sales?${buildQuery()}`)
            .then((response) => {
                setSales(response.data.data);
                setMeta(response.data.meta.pagination);
            }).catch((error) => {
                console.log("Error al buscar FV:", error);
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchData();
    }, [page, pageSize, filters]);

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value));
        setPage(1);
    }



    return <div className='py-4 md:py-6 px-4 lg:px-6'>
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Ventas Mensuales</CardTitle>
                <CardDescription>
                    <span>Lista de Ventas del Mes   <span className="font-bold">
                        {(() => {
                            const today = new Date();

                            // Primer día del mes
                            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

                            // Último día del mes
                            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                            // Formato de fecha
                            const options = { day: "2-digit", month: "2-digit", year: "numeric" };

                            return `${firstDay.toLocaleDateString("es-CL", options)} - ${lastDay.toLocaleDateString("es-CL", options)}`;
                        })()}
                    </span> </span>
                </CardDescription>
            </CardHeader>

            <CardContent>
                {loading ?
                    (<p className="text-muted-foreground">Cargando...</p>
                    ) : (
                        <DataTable columns={columns} data={sales} />
                    )}

                <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                    {meta && (
                        <>
                            {sales.length === 0
                                ? "No rows"
                                : `Mostrando ${(meta.page - 1) * meta.pageSize + 1} a ${(meta.page - 1) * meta.pageSize + sales.length
                                } de ${meta.total} registros`}
                        </>
                    )}

                    <div className="flex items-center gap-2">
                        <Select
                            value={String(pageSize)}
                            onValueChange={handlePageSizeChange}
                        >
                            <SelectTrigger className="w-[80px] h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                        <span>Registros x pagina</span>
                    </div>
                    <span className="whitespace-nowrap">
                        Pagina {meta?.page} de {meta?.pageCount}
                    </span>

                    {/* Paginación*/}
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setPage(1)}
                            disabled={page === 1}
                        >
                            «
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                        >
                            ‹
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                                setPage((prev) => Math.min(prev + 1, meta?.pageCount || 1))
                            }
                            disabled={page === meta?.pageCount}
                        >
                            ›
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setPage(meta?.pageCount)}
                            disabled={page === meta?.pageCount}
                        >
                            »
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

    </div>
}

export default Page