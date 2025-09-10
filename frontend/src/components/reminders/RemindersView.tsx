import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Pill, Stethoscope, Check, Clock, Plus, CheckCircle2, Circle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'medication' | 'appointment' | 'checkup' | 'exercise';
  status: 'pending' | 'completed';
  date: string;
}

export const RemindersView = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Take Prenatal Vitamins',
      description: 'Folic acid and iron supplements',
      time: '9:00 AM',
      type: 'medication',
      status: 'pending',
      date: '2024-12-01'
    },
    {
      id: '2',
      title: 'Doctor Appointment',
      description: 'Monthly checkup with Dr. Mensah',
      time: '2:00 PM',
      type: 'appointment',
      status: 'pending',
      date: '2024-12-02'
    },
    {
      id: '3',
      title: 'Prenatal Yoga Class',
      description: 'Gentle stretching and breathing exercises',
      time: '6:00 PM',
      type: 'exercise',
      status: 'completed',
      date: '2024-11-30'
    },
    {
      id: '4',
      title: 'Blood Pressure Check',
      description: 'Weekly monitoring at home',
      time: '8:00 AM',
      type: 'checkup',
      status: 'pending',
      date: '2024-12-01'
    }
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'medication' as 'medication' | 'appointment' | 'checkup' | 'exercise'
  });

  const addReminder = () => {
    if (!newReminder.title || !newReminder.date || !newReminder.time) {
      import('sonner').then(({ toast }) => {
        toast.error('Missing Information', {
          description: 'Please fill in all required fields.',
          duration: 3000,
        });
      });
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description || 'No description',
      time: newReminder.time,
      type: newReminder.type,
      status: 'pending',
      date: newReminder.date
    };

    setReminders(prev => [...prev, reminder]);
    setNewReminder({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'medication'
    });
    setIsAddModalOpen(false);
    
    import('sonner').then(({ toast }) => {
      toast.success('Reminder Added!', {
        description: `${reminder.title} has been scheduled.`,
        duration: 3000,
      });
    });
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, status: reminder.status === 'pending' ? 'completed' : 'pending' }
          : reminder
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="w-5 h-5" />;
      case 'appointment': return <Stethoscope className="w-5 h-5" />;
      case 'checkup': return <Calendar className="w-5 h-5" />;
      case 'exercise': return <div className="w-5 h-5 rounded-full bg-gradient-primary"></div>;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'appointment': return 'bg-gradient-to-r from-teal-500 to-teal-600';
      case 'checkup': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'exercise': return 'bg-gradient-to-r from-green-500 to-green-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'appointment': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'checkup': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'exercise': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const pendingReminders = useMemo(() => reminders.filter(r => r.status === 'pending'), [reminders]);
  const completedReminders = useMemo(() => reminders.filter(r => r.status === 'completed'), [reminders]);
  const todayReminders = useMemo(() => {
    const today = new Date().toDateString();
    return reminders.filter(r => new Date(r.date).toDateString() === today);
  }, [reminders]);

  return (
    <div className="min-h-screen bg-gradient-hero pb-24 animate-fade-in">
      <div className="px-4 space-y-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden">
          <div className="h-32 bg-gradient-primary relative rounded-2xl">
            <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
            <div className="relative z-10 p-6 text-white flex items-center justify-between h-full">
              <div className="animate-slide-up">
                <h1 className="text-2xl font-bold mb-1">Reminders</h1>
                <p className="text-white/80">Stay on track with your health</p>
              </div>
              <div className="text-right animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-2xl font-bold">{todayReminders.length}</div>
                <div className="text-sm text-white/80">Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Reminder Button */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="gradient" 
                size="lg" 
                className="w-full h-14 text-base font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center mb-4">Add New Reminder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Take prenatal vitamins"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional details (optional)"
                    value={newReminder.description}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                    className="border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newReminder.date}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
                      className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-medium">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                      className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                  <Select value={newReminder.type} onValueChange={(value: any) => setNewReminder(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">💊 Medication</SelectItem>
                      <SelectItem value="appointment">🩺 Appointment</SelectItem>
                      <SelectItem value="checkup">📅 Checkup</SelectItem>
                      <SelectItem value="exercise">🏃‍♀️ Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addReminder}
                    variant="gradient"
                    className="flex-1 h-12 rounded-xl"
                  >
                    Add Reminder
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Modern Tabs */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/50 backdrop-blur-sm border border-white/20">
              <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Pending ({pendingReminders.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Completed ({completedReminders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingReminders.length > 0 ? (
                pendingReminders.map((reminder, index) => (
                  <div
                    key={reminder.id}
                    className="bg-gradient-card rounded-2xl p-5 shadow-lg border-0 hover:shadow-xl transition-all duration-200 animate-slide-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className="mt-1 text-gray-400 hover:text-primary transition-colors duration-200"
                      >
                        <Circle className="w-6 h-6" />
                      </button>
                      
                      <div className={`p-3 rounded-xl ${getTypeColor(reminder.type)} text-white shadow-md`}>
                        {getTypeIcon(reminder.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="font-bold text-foreground text-lg leading-tight">
                            {reminder.title}
                          </h3>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={`text-xs font-medium ${getTypeBadgeColor(reminder.type)}`}>
                              {formatDate(reminder.date)}
                            </Badge>
                            <span className="text-sm font-semibold text-primary">
                              {reminder.time}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {reminder.description}
                        </p>
                        
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => {
                            toggleReminder(reminder.id);
                            import('sonner').then(({ toast }) => {
                              toast.success('Reminder completed!', {
                                description: `${reminder.title} marked as done.`,
                                duration: 2000,
                              });
                            });
                          }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gradient-card rounded-2xl shadow-lg">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    No pending reminders
                  </h3>
                  <p className="text-muted-foreground">
                    Great job! You're all caught up.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedReminders.length > 0 ? (
                completedReminders.map((reminder, index) => (
                  <div
                    key={reminder.id}
                    className="bg-gradient-card rounded-2xl p-5 shadow-lg border-0 opacity-75 hover:opacity-100 transition-all duration-200 animate-slide-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className="mt-1 text-green-500 hover:text-green-600 transition-colors duration-200"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                      
                      <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
                        <Check className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="font-bold text-foreground text-lg leading-tight line-through decoration-2">
                            {reminder.title}
                          </h3>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className="text-xs font-medium bg-green-100 text-green-700 border-green-200">
                              Completed
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {reminder.time}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 leading-relaxed line-through">
                          {reminder.description}
                        </p>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toggleReminder(reminder.id);
                            import('sonner').then(({ toast }) => {
                              toast.info('Reminder restored', {
                                description: `${reminder.title} moved back to pending.`,
                                duration: 2000,
                              });
                            });
                          }}
                          className="text-xs border-gray-300 hover:border-primary hover:text-primary"
                        >
                          Undo
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gradient-card rounded-2xl shadow-lg">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    No completed reminders
                  </h3>
                  <p className="text-muted-foreground">
                    Complete some tasks to see them here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>


      </div>
    </div>
  );
};