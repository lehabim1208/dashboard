"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { Plus, User, ChevronDown, LogOut, Menu, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

interface Reporte {
  id: number
  titulo: string
  zona: string
  senal: string
}

export default function CrearReporte() {
  const [openCobertura, setOpenCobertura] = useState(false)
  const [openRestricciones, setOpenRestricciones] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [nuevoReporte, setNuevoReporte] = useState<Omit<Reporte, "id">>({
    titulo: "",
    zona: "",
    senal: "",
  })
  const [isOpen, setIsOpen] = useState(false)
  const [reporteAEliminar, setReporteAEliminar] = useState<number | null>(null)
  const [reporteAEditar, setReporteAEditar] = useState<Reporte | null>(null)
  const { toast } = useToast()
  const router = useRouter()


   const handleLogout = () => {
    Swal.fire({
      title: 'Cerrando sesión',
      html: '<i class="fas fa-spinner fa-spin"></i>',
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 3000,
      didOpen: () => {
        Swal.showLoading()
      }
    }).then(() => {
      // Aquí puedes agregar la lógica para cerrar la sesión si es necesario
      // Por ejemplo, limpiar el localStorage o las cookies
      router.push('/login')
    })
  }

  // Cargar reportes desde localStorage al iniciar
  useEffect(() => {
    const reportesCached = localStorage.getItem('reportes')
    if (reportesCached) {
      setReportes(JSON.parse(reportesCached))
    }
  }, [])

  const SidebarContent = () => (
    <nav className="p-4">
      <Link href="/dashboard">
       <div className="mb-6 text-xl font-bold">Mi RIUV</div>
      </Link>
      <ul className="space-y-2">
        <li>
          <Button variant="ghost" className="w-full justify-start font-normal">
            <User className="mr-2 h-4 w-4" />
            <Link href="/perfil"
                    className="block py-1 text-sm text-black hover:text-blue-600"
                  >Mi perfil
            </Link>
          </Button>
        </li>
        <li>
          <Collapsible
            open={openCobertura}
            onOpenChange={setOpenCobertura}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between font-normal"
              >
                Cobertura
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openCobertura ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 pt-1">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/crear-reporte"
                    className="block py-1 text-sm text-gray-500 hover:text-blue-600"
                  >
                    Mis reportes
                  </Link>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </li>
        <li>
          <Collapsible
            open={openRestricciones}
            onOpenChange={setOpenRestricciones}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between font-normal"
              >
                Restricciones
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openRestricciones ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 pt-1">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/crear-reporte-rest"
                    className="block py-1 text-sm text-gray-500 hover:text-blue-600"
                  >
                    Mis reportes
                  </Link>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </li>
        <li>
          <Button variant="ghost" className="w-full justify-start font-normal">
            <Link href="/estadistica"
                    className="block py-1 text-sm text-black hover:text-blue-600"
                  >Estadísticas
            </Link>
          </Button>
        </li>
        <li>
        <Button 
          variant="ghost" 
          className="w-full justify-start font-normal text-red-500 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
        </li>
      </ul>
    </nav>
  )

  const handleCrearReporte = () => {
    if (nuevoReporte.titulo && nuevoReporte.zona && nuevoReporte.senal) {
      const nuevoId = reportes.length > 0 ? Math.max(...reportes.map(r => r.id)) + 1 : 1
      const nuevosReportes = [...reportes, { id: nuevoId, ...nuevoReporte }]
      setReportes(nuevosReportes)
      localStorage.setItem('reportes', JSON.stringify(nuevosReportes))
      setNuevoReporte({ titulo: "", zona: "", senal: "" })
      setIsOpen(false)
      toast({
        title: "Reporte creado",
        description: "El reporte se ha creado con éxito.",
      })
    }
  }

  const handleEliminarReporte = () => {
    if (reporteAEliminar) {
      const nuevosReportes = reportes.filter(reporte => reporte.id !== reporteAEliminar)
      setReportes(nuevosReportes)
      localStorage.setItem('reportes', JSON.stringify(nuevosReportes))
      setReporteAEliminar(null)
      toast({
        title: "Reporte eliminado",
        description: "El reporte se ha eliminado con éxito.",
      })
    }
  }

  const handleEditarReporte = () => {
    if (reporteAEditar) {
      const nuevosReportes = reportes.map(reporte =>
        reporte.id === reporteAEditar.id ? reporteAEditar : reporte
      )
      setReportes(nuevosReportes)
      localStorage.setItem('reportes', JSON.stringify(nuevosReportes))
      setReporteAEditar(null)
      toast({
        title: "Reporte editado",
        description: "El reporte se ha editado con éxito.",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      {/* Menú lateral para pantallas medianas y grandes */}
      <aside className="hidden w-64 bg-white shadow-md md:block">
        <SidebarContent />
      </aside>

      {/* Menú lateral para pantallas pequeñas */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Contenido principal */}
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="pl-14 text-2xl font-bold md:pl-0 md:text-3xl mb-4">Mis reportes</h1>
          <h2 className="pl-14 text-lg font-bold md:pl-0 text-gray-500 mb-4">Cobertura</h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Reporte
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Reporte</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="titulo" className="text-right">
                    Título
                  </Label>
                  <Input
                    id="titulo"
                    value={nuevoReporte.titulo}
                    onChange={(e) => setNuevoReporte({ ...nuevoReporte, titulo: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="zona" className="text-right">
                    Zona
                  </Label>
                  <Input
                    id="zona"
                    value={nuevoReporte.zona}
                    onChange={(e) => setNuevoReporte({ ...nuevoReporte, zona: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="senal" className="text-right">
                    Señal
                  </Label>
                  <Select
                    onValueChange={(value) => setNuevoReporte({ ...nuevoReporte, senal: value })}
                  >
                    <SelectTrigger className="col-span-3 bg-white">
                      <SelectValue placeholder="Selecciona la señal" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="buena">Buena</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="mala">Mala</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="bg-black text-white" onClick={handleCrearReporte}>Crear Reporte</Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contenedor centrado para la tabla */}
        <div className="max-w-4xl mx-auto bg-gray-200 rounded-lg p-4">
          {/* Tabla de reportes */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Zona</TableHead>
                <TableHead>Señal</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportes.map((reporte) => (
                <TableRow key={reporte.id}>
                  <TableCell>{reporte.id}</TableCell>
                  <TableCell>{reporte.titulo}</TableCell>
                  <TableCell>{reporte.zona}</TableCell>
                  <TableCell>{reporte.senal}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => setReporteAEditar(reporte)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => setReporteAEliminar(reporte.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={reporteAEliminar !== null} onOpenChange={() => setReporteAEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar este reporte?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-200 text-gray-800">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 text-white" onClick={handleEliminarReporte}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal para editar reporte */}
      <Dialog open={reporteAEditar !== null} onOpenChange={() => setReporteAEditar(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Reporte</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-titulo" className="text-right">
                Título
              </Label>
              <Input
                id="edit-titulo"
                value={reporteAEditar?.titulo || ""}
                onChange={(e) => setReporteAEditar(reporteAEditar ? {...reporteAEditar, titulo: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-zona" className="text-right">
                Zona
              </Label>
              <Input
                id="edit-zona"
                value={reporteAEditar?.zona || ""}
                onChange={(e) => setReporteAEditar(reporteAEditar ? {...reporteAEditar, zona: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-senal" className="text-right">
                Señal
              </Label>
              <Select
                onValueChange={(value) => setReporteAEditar(reporteAEditar ? {...reporteAEditar, senal: value} : null)}
                value={reporteAEditar?.senal}
              >
                <SelectTrigger className="col-span-3 bg-white">
                  <SelectValue placeholder="Selecciona la señal" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="buena">Buena</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="mala">Mala</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-black text-white w-full" onClick={handleEditarReporte}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}