"use client"
import { useEffect, useState } from "react";
import { DataTable } from './features/data-table'
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
import { Sheet } from "@/components/ui/sheet";
import { New } from "./features/new";
import { toast } from "sonner";


const Page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({name: "", barcode: ""});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleFilterChange = (key, value) =>{
    setFilters((prev) => ({...prev, [key]: value}));
    setPage(1);
  };

  const handleDelete = async (item) =>{
    if (!confirm(`Estás seguro de borrar el producto "${item.name}"?`)) return;

    try{
      await axiosInstance.delete(`/api/products/${item.documentId}`);
      await fetchData();
      toast.success("Producto eliminado correctamente");
    } catch (error){
      console.log("Error al borrar el producto:", error);
      toast.error("Error al borrar el producto");
    }
  }

  const columns = getColumns(filters, handleFilterChange, (item) =>{
    setSelectedItem(item);
    setSheetOpen(true);
  }, handleDelete);

  const buildQuery =() =>{
    const query = new URLSearchParams();
    query.set("pagination[page]", page);
    query.set("pagination[pageSize]", pageSize);
    query.set("populate[0]", "category");
    query.set("populate[1]", "image");

    if(filters.name){
      query.set("filters[name][$containsi]", filters.name);
    }
    if(filters.barcode){
      query.set("filters[barcode][$containsi]", filters.barcode);
    }

    return query.toString();
  }

  const fetchData = () =>{
    setLoading(true);
    axiosInstance
      .get(`/api/products?${buildQuery()}`)
      .then((response) => {
        console.log("Productos encontrados:", response.data);
        setProducts(response.data.data);
        setMeta(response.data.meta.pagination);
      }).catch((error) => {
        console.log("Error al buscar los productos:", error);
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
        <CardTitle>Productos</CardTitle>
        <CardDescription>
          <span>Lista de productos</span>
        </CardDescription>

        <CardAction>
          <Button onClick={() =>{
            setSelectedItem(null);
            setSheetOpen(true);           
          }} className={"text-white"}>Agregar nuevo producto</Button>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <New
            item={selectedItem}
            isOpen={sheetOpen}
            onSuccess={() =>{
              setSheetOpen(false);
              fetchData();
            }}/>
          </Sheet>
        </CardAction>
      </CardHeader>

      <CardContent>
        {loading ?
          (<p className="text-muted-foreground">Cargando...</p>
          ) : (
            <DataTable columns={columns} data={products} />
          )}

        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          {meta && (
            <>
              {products.length === 0
                ? "No rows"
                : `Mostrando ${(meta.page - 1) * meta.pageSize + 1} a ${(meta.page - 1) * meta.pageSize + products.length
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