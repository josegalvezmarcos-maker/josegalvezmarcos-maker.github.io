import { useEffect, useRef, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  ArrowLeft,
  Check,
  Download,
  HardDrive,
  Menu,
  RotateCcw,
  Settings2,
  TriangleAlert,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LanguageToggle } from '@/components/site/language-toggle'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import {
  exportWorkspace,
  importWorkspace,
  readShareHash,
  resetWorkspace,
  useWorkspace,
  type SharedPayload,
} from '@/lib/workspace'
import { FeedbackDialog } from './feedback-dialog'
import { GROUP_LABELS, HOME_ITEM, NAV, type NavItem } from './nav'

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { tr } = useLanguage()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const current = pathname.replace(/\/$/, '')

  const linkClass = (active: boolean) =>
    cn(
      'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
      active
        ? 'bg-primary/15 font-medium text-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
    )

  const groups: NavItem['group'][] = ['plan', 'improve', 'learn']
  return (
    <nav className="space-y-5">
      <Link
        to={HOME_ITEM.to}
        onClick={onNavigate}
        className={linkClass(current === '/app')}
      >
        <HOME_ITEM.icon className="size-4 shrink-0" />
        {tr(HOME_ITEM.label)}
      </Link>
      {groups.map((group) => (
        <div key={group}>
          <p className="mb-1.5 px-2.5 font-data text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            {tr(GROUP_LABELS[group])}
          </p>
          <ul className="space-y-0.5">
            {NAV.filter((n) => n.group === group).map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={linkClass(current === item.to)}
                >
                  <item.icon className="size-4 shrink-0" />
                  {tr(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function Brand() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 rounded-md font-display text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary font-data text-xs font-bold text-primary-foreground">
        JG
      </span>
      <span className="leading-tight">Pie de campo</span>
    </Link>
  )
}

function DataMenu() {
  const { tr } = useLanguage()
  const fileInput = useRef<HTMLInputElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const download = () => {
    const url = URL.createObjectURL(
      new Blob([exportWorkspace()], { type: 'application/json' }),
    )
    const a = document.createElement('a')
    a.href = url
    a.download = `pie-de-campo-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    const ok = file.size < 1000000 && importWorkspace(await file.text())
    if (ok) toast.success(tr({ es: 'Datos cargados', en: 'Data loaded' }))
    else
      toast.error(
        tr({
          es: 'Ese archivo no es una copia válida',
          en: 'That file is not a valid backup',
        }),
      )
    if (fileInput.current) fileInput.current.value = ''
  }

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={tr({ es: 'Datos', en: 'Data' })}
          >
            <Settings2 />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={download}>
            <Download />
            {tr({ es: 'Descargar copia', en: 'Download backup' })}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => fileInput.current?.click()}>
            <Upload />
            {tr({ es: 'Cargar copia', en: 'Load backup' })}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setConfirmReset(true)}>
            <RotateCcw />
            {tr({ es: 'Volver al ejemplo', en: 'Back to the example' })}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {tr({ es: '¿Borrar tus datos?', en: 'Delete your data?' })}
            </DialogTitle>
            <DialogDescription>
              {tr({
                es: 'Se sustituye todo lo guardado en este navegador por los datos de ejemplo. No se puede deshacer si no tienes una copia.',
                en: 'Everything saved in this browser is replaced by the example data. It cannot be undone without a backup.',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              {tr({ es: 'Cancelar', en: 'Cancel' })}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetWorkspace()
                setConfirmReset(false)
              }}
            >
              {tr({ es: 'Borrar', en: 'Delete' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function SharedLinkPrompt() {
  const { tr } = useLanguage()
  const [shared, setShared] = useState<SharedPayload | null>(null)

  useEffect(() => {
    const result = readShareHash(window.location.hash)
    if (result === 'invalid') {
      window.history.replaceState(null, '', window.location.pathname)
      // The toaster mounts after this effect runs, and the stored language is
      // not applied yet on first render, so the message carries both.
      setTimeout(() =>
        toast.error('Enlace compartido no válido · Invalid shared link'),
      )
    } else if (result) {
      // The URL hash only exists in the browser, so it cannot be read during render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShared(result)
    }
  }, [])

  const close = () => {
    setShared(null)
    window.history.replaceState(null, '', window.location.pathname)
  }

  return (
    <Dialog open={shared !== null} onOpenChange={(o) => !o && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tr({
              es: 'Te han compartido un plan',
              en: 'A plan was shared with you',
            })}
          </DialogTitle>
          <DialogDescription>
            {tr({
              es: 'Si lo abres, sustituye lo que tengas guardado en esta herramienta.',
              en: 'Opening it replaces what you have saved in this tool.',
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={close}>
            {tr({ es: 'Conservar lo mío', en: 'Keep mine' })}
          </Button>
          <Button
            onClick={() => {
              shared?.apply()
              close()
            }}
          >
            {tr({ es: 'Abrir el plan', en: 'Open the plan' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { tr } = useLanguage()
  const { isPersisted } = useWorkspace()
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const scroller = useRef<HTMLElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo(0, 0)
  }, [pathname])

  const sidebar = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col gap-6 p-4">
      <Brand />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <NavLinks onNavigate={onNavigate} />
      </div>
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none"
      >
        <ArrowLeft className="size-3.5" />
        {tr({ es: 'Volver a la web', en: 'Back to the website' })}
      </Link>
    </div>
  )

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-border/70 bg-[#0c1426] lg:block">
        {sidebar()}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/70 px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label={tr({ es: 'Abrir menú', en: 'Open menu' })}
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-[#0c1426] p-0">
                <SheetTitle className="sr-only">
                  {tr({ es: 'Menú', en: 'Menu' })}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  {tr({ es: 'Herramientas', en: 'Tools' })}
                </SheetDescription>
                {sidebar(() => setMenuOpen(false))}
              </SheetContent>
            </Sheet>
            <p
              className={cn(
                'flex min-w-0 items-center gap-1.5 truncate text-xs',
                isPersisted ? 'text-muted-foreground' : 'text-warning',
              )}
            >
              {isPersisted ? (
                <>
                  <HardDrive className="size-3.5 shrink-0" />
                  <span className="hidden sm:inline">
                    {tr({
                      es: 'Se guarda solo en este navegador',
                      en: 'Saved only in this browser',
                    })}
                  </span>
                  <Check className="size-3.5 shrink-0 text-success" />
                </>
              ) : (
                <>
                  <TriangleAlert className="size-3.5 shrink-0" />
                  {tr({
                    es: 'Este navegador no permite guardar',
                    en: 'This browser cannot save',
                  })}
                </>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <FeedbackDialog context={`Page: ${pathname}`} />
            <DataMenu />
            <LanguageToggle />
          </div>
        </header>
        <main
          ref={scroller}
          className="min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-6 sm:py-6"
        >
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </div>
      <SharedLinkPrompt />
    </div>
  )
}
