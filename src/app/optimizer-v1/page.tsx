'use client';

import { useState, useMemo, useRef } from 'react';
import {
  Cpu,
  FileText,
  FileUp,
  Loader,
  Play,
  Settings,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  VariableEditor,
  type CircuitVariable,
} from '@/components/variable-editor';
import { Logo } from '@/components/icons/logo';

const Header = () => (
    <header className="flex items-center justify-between border-b pb-4">
    <div className="flex items-center gap-3">
      <Logo className="h-10 w-10 text-primary" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Circuit Optimizer v1
        </h1>
        <p className="text-muted-foreground">
            The original version of the circuit optimization tool.
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


export default function OptimizerPageV1() {
  const { toast } = useToast();
  const [ocnFile, setOcnFile] = useState<File | null>(null);
  const [yamlFile, setYamlFile] = useState<File | null>(null);
  const [simulator, setSimulator] = useState<string>('');

  const [configLoaded, setConfigLoaded] = useState(false);
  const [designVariables, setDesignVariables] = useState<CircuitVariable[]>([]);
  const [testVariables, setTestVariables] = useState<CircuitVariable[]>([]);
  
  const [simulationRunning, setSimulationRunning] = useState(false);
  
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
    // Mock parsing files and setting variables
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

    toast({
        title: 'Bypassed Load',
        description: 'Loaded dummy data for development.',
    });
  }

  const handleLoadConfiguration = () => {
    if (!isLoadReady) {
       toast({
        variant: "destructive",
        title: "Missing Inputs",
        description: "Please select a simulator and upload a circuit file.",
      });
      return;
    }
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
    
    setSimulationRunning(true);
    
    setTimeout(() => {
      setSimulationRunning(false);
      toast({
        title: 'Simulation Complete',
        description: 'The simulation run has finished.',
      });
    }, 2500);
  };
  
  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-8">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Settings className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Load & Run</CardTitle>
                            <CardDescription>
                                Load files and run the simulation.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
                <CardFooter className="flex-col gap-2 items-stretch">
                    <Button onClick={handleLoadConfiguration} disabled={!isLoadReady}>
                      Load Configuration
                    </Button>
                    <Button onClick={loadDummyData} variant="secondary">
                        <Zap className="mr-2 h-4 w-4" />
                        Bypass Load
                    </Button>
                    <Button onClick={handleRunSimulation} disabled={isRunDisabled}>
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
                </CardFooter>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-md">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Cpu className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                    <CardTitle>Optimizer Configuration</CardTitle>
                    <CardDescription>
                        Adjust optimization and test design variables.
                    </CardDescription>
                    </div>
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
                      <p className="text-muted-foreground">Load configuration to enable controls</p>
                  </div>
                )}
            </CardContent>
            </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
