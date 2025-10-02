"use client"

import ColumnFilter from "@/components/ColumnFilter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import Image from "next/image";

export const getColumns = (filters, handleFilterChange, onEdit, onDelete) => [
  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({ row }) => (
      <div className="h-12 w-12 rounded overflow-hidden">
        {row.original.image &&
          <Image
            src={process.env.NEXT_PUBLIC_STRAPI_URL + row.original.image.formats.thumbnail.url}
            alt={row.original.name}
            width={48}
            height={48}
            className="object-cover"
          />
        }
      </div>
    )
  },
  {
    accessorKey: "barcode",
    header: () => (
      <ColumnFilter
        label={"Codigo"}
        placeholder={"Filtrar codigo..."}
        value={filters.barcode || ""}
        onChange={(val) => handleFilterChange("barcode", val)} />
    ),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "name",
    header: () => (
      <ColumnFilter
        label={"Nombre"}
        placeholder={"Filtrar nombre..."}
        value={filters.name || ""}
        onChange={(val) => handleFilterChange("name", val)} />
    ),
    cell: (info) => info.getValue(),
  },
  { accessorKey: "category.name", header: "Categoría" },
  { accessorKey: "price", header: "Precio" },
  { accessorKey: "stock", header: "Stock" },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon">
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={() => {
              onEdit(row.original);
            }}
          ><IconEdit />Editar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive"
            onClick={() => {
              onDelete(row.original);
            }}
          ><IconTrash />Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }

]