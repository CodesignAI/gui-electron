'use client';

import { useState, useMemo, useRef } from 'react';
import {
  Cpu,
  FileText,
  FileUp,
  Loader,
  Play,
  SlidersHorizontal,
  X,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  VariableEditor,
  type CircuitVariable,
} from '@/components/variable-editor';
import { Logo } from '@/components/icons/logo';
import { Progress } from '@/components/ui/progress';

const Header = () => (
  <header className="flex items-center justify-between border-b pb-4">
    <div className="flex items-center gap-3">
      <Logo className="h-10 w-10 text-primary" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Circuit Optimizer v2
        </h1>
        <p className="text-muted-foreground">
          A professional application to configure and run simulations
        </p>
      </div>
    </div>
    <Button variant="outline" asChild>
      <Link href="/">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
    </Button>
  </header>
);

const FileUpload = ({
  id,
  label,
  file,
  onFileChange,
  onFileRemove,
  accept,
}: {
  id: string;
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  onFileRemove: () => void;
  accept: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {file ? (
        <div className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
          <div className="flex items-center gap-2 truncate">
            <FileText className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{file.name}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onFileRemove}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
          onClick={() => inputRef.current?.click()}
        >
          <FileUp className="mr-2 h-4 w-4" />
          Click to upload a file
        </Button>
      )}
      <input
        type="file"
        id={id}
        ref={inputRef}
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        className="sr-only"
        accept={accept}
      />
    </div>
  );
};

export default function OptimizerPageV2() {
  const { toast } = useToast();
  const [ocnFile, setOcnFile] = useState<File | null>(null);
  const [yamlFile, setYamlFile] = useState<File | null>(null);
  const [simulator, setSimulator] = useState<string>('');
  const [isLoadModalOpen, setLoadModalOpen] = useState(false);
  const [isSimModalOpen, setSimModalOpen] = useState(false);

  const [configLoaded, setConfigLoaded] = useState(false);
  const [designVariables, setDesignVariables] = useState<CircuitVariable[]>([]);
  const [testVariables, setTestVariables] = useState<CircuitVariable[]>([]);
  
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  
  const isLoadReady = useMemo(() => ocnFile && simulator, [ocnFile, simulator]);

  const isRunDisabled = useMemo(
    () =>
      !configLoaded ||
      simulationRunning ||
      [...designVariables, ...testVariables].some(
        (v) => v.min === null || v.max === null || v.min >= v.max
      ),
    [configLoaded, simulationRunning, designVariables, testVariables]
  );

  const loadDummyData = () => {
    const DUMMY_DESIGN_VARS = [
      { name: 'v_bias_1', min: 0.8, max: 1.2 },
      { name: 'i_ref_main', min: 0.00001, max: 0.00005 },
      { name: 'w_nmos_diff', min: 0.000001, max: 0.00001 },
      { name: 'l_pmos_casc', min: 0.00000018, max: 0.000001 },
      { name: 'res_value', min: 1000, max: 10000 },
      { name: 'cap_value', min: 0.000000000001, max: 0.00000000001 },
    ];
    const DUMMY_TEST_VARS = [
      { name: 'temp_corner', min: -40, max: 125 },
      { name: 'vdd_corner', min: 1.62, max: 1.98 },
    ];

    setDesignVariables(DUMMY_DESIGN_VARS);
    setTestVariables(DUMMY_TEST_VARS);
    setConfigLoaded(true);
    setLoadModalOpen(false);

    toast({
      title: 'Bypassed Load',
      description: 'Loaded dummy data for development.',
    });
  };

  const handleLoadConfiguration = () => {
    if (!isLoadReady) {
       toast({
        variant: "destructive",
        title: "Missing Inputs",
        description: "Please select a simulator and upload a circuit file.",
      });
      return;
    }

    // This is where you would normally parse the files
    // For now, we just use the dummy data function
    loadDummyData();
    
    toast({
      title: 'Configuration Loaded',
      description: `Loaded ${ocnFile?.name}${
        yamlFile ? ' with ' + yamlFile.name : ''
      }.`,
    });
  };

  const handleRunSimulation = () => {
    if (isRunDisabled) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please ensure all min/max values are valid before running.',
      });
      return;
    }
    
    setSimModalOpen(true);
    setSimulationRunning(true);
    setSimulationProgress(0);
    setSimulationLog([`[${new Date().toLocaleTimeString()}] Simulation started with ${simulator}...`]);
    
    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setSimulationRunning(false);
          setSimulationLog((log) => [...log, `[${new Date().toLocaleTimeString()}] Simulation finished successfully.`]);
          toast({
            title: 'Simulation Complete',
            description: 'The simulation run has finished.',
          });
          return 100;
        }
        setSimulationLog((log) => [...log, `[${new Date().toLocaleTimeString()}] Analysis running... corner ${Math.floor(Math.random() * 5)} complete.`]);
        return newProgress;
      });
    }, 800);
  };
  
  return (
    <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-8">
        <Header />

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <SlidersHorizontal className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Configuration</CardTitle>
                  <CardDescription>
                    {configLoaded ? 'Adjust optimization and test design variables.' : 'Load configuration to begin.'}
                  </CardDescription>
                </div>
              </div>
              <Dialog open={isLoadModalOpen} onOpenChange={setLoadModalOpen}>
                <DialogTrigger asChild>
                  <Button>{configLoaded ? "Reload Configuration" : "Load Configuration"}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Load Configuration</DialogTitle>
                    <DialogDescription>
                      Select simulator and upload files.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <FileUpload
                      id="yaml-upload"
                      label="YAML Preconfiguration (Optional)"
                      file={yamlFile}
                      onFileChange={setYamlFile}
                      onFileRemove={() => setYamlFile(null)}
                      accept=".yml,.yaml"
                    />
                     <FileUpload
                      id="ocn-upload"
                      label="Circuit File (*.ocn)"
                      file={ocnFile}
                      onFileChange={setOcnFile}
                      onFileRemove={() => setOcnFile(null)}
                      accept=".ocn"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="simulator-select">Simulator</Label>
                      <Select value={simulator} onValueChange={setSimulator}>
                        <SelectTrigger id="simulator-select">
                          <SelectValue placeholder={
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Cpu className="h-4 w-4" />
                              <span>Select a simulator...</span>
                            </div>
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cadence">Cadence</SelectItem>
                          <SelectItem value="Mathcad">Mathcad</SelectItem>
                          <SelectItem value="Excel">Excel</SelectItem>
                          <SelectItem value="PLECS">PLECS</SelectItem>
                          <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className='gap-2 sm:justify-between'>
                    <Button variant="secondary" onClick={loadDummyData}>
                       <Zap className="mr-2 h-4 w-4" />
                       Bypass Load
                    </Button>
                    <Button type="button" onClick={handleLoadConfiguration} disabled={!isLoadReady}>
                      Load
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
             {configLoaded ? (
              <fieldset disabled={!configLoaded} className="space-y-6">
                <Tabs defaultValue="design">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="design">Design Variables</TabsTrigger>
                    <TabsTrigger value="test">Test Design</TabsTrigger>
                  </TabsList>
                  <TabsContent value="design" className="mt-4">
                     <VariableEditor
                      variables={designVariables}
                      onVariablesChange={setDesignVariables}
                    />
                  </TabsContent>
                  <TabsContent value="test" className="mt-4">
                     <VariableEditor
                      variables={testVariables}
                      onVariablesChange={setTestVariables}
                    />
                  </TabsContent>
                </Tabs>
              </fieldset>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                  <p className="text-muted-foreground">Click "Load Configuration" to enable controls</p>
              </div>
            )}
          </CardContent>
          {configLoaded && (
             <CardFooter>
                 <Dialog open={isSimModalOpen} onOpenChange={setSimModalOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleRunSimulation} disabled={isRunDisabled} size="lg">
                         {simulationRunning ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Running...
                          </>
                        ) : (
                           <>
                            <Play className="mr-2 h-4 w-4" />
                            Start Simulation
                          </>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Simulation Status</DialogTitle>
                           <DialogDescription>
                            Executing the simulation with the specified configurations.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <Separator />
                          <div className="space-y-2">
                            <Label>Progress</Label>
                            <Progress value={simulationProgress} />
                          </div>
                          <div className="space-y-2">
                            <Label>Simulation Log</Label>
                            <div className="h-48 w-full rounded-md border bg-muted p-3 text-sm font-mono">
                              <pre className="h-full w-full overflow-auto whitespace-pre-wrap break-all">
                                {simulationLog.join('\n')}
                              </pre>
                            </div>
                          </div>
                        </div>
                         <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="secondary" disabled={simulationRunning}>
                              {simulationRunning ? "Close (runs in background)" : "Close"}
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                 </Dialog>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
