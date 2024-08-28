const cron = require('node-cron');
const { exec } = require('child_process');
const Veille = require('../../Models/veilleModel');
const sharedEmitter = require('../../Utils/SharedEmitter'); // Adjust the path
const restartJob = require('../../Cronjob/restartJob'); // Adjust the path
const sinon = require('sinon');
const { EventEmitter } = require('events');

jest.mock('node-cron');
jest.mock('child_process', () => ({
  exec: jest.fn()
}));
jest.mock('../../Models/veilleModel');

describe('restartJob', () => {
  let veilleStub;

  beforeEach(() => {
    veilleStub = sinon.stub(Veille.prototype, 'getAll');
    cron.schedule.mockClear();
    exec.mockClear();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('start', () => {
    it('should schedule a reboot with the correct time', async () => {
      const mockRestartTime = '03:15';
      veilleStub.resolves([{ restart_at: mockRestartTime }]);
      
      await restartJob.start();

      expect(veilleStub.calledOnce).toBe(true);
      const [hour, minute] = mockRestartTime.split(':');
      expect(cron.schedule).toHaveBeenCalledWith(`${minute} ${hour} * * *`, expect.any(Function), {
        scheduled: true,
        timezone: 'Europe/Paris'
      });
    });

    it('should handle no restart times being returned', async () => {
      veilleStub.resolves([]);
      
      await restartJob.start();

      expect(veilleStub.calledOnce).toBe(true);
      expect(console.error).toHaveBeenCalledWith('No restart time found.');
      expect(cron.schedule).not.toHaveBeenCalled();
    });

    it('should handle errors while retrieving restart time', async () => {
      const mockError = new Error('Database error');
      veilleStub.rejects(mockError);
      
      await restartJob.start();

      expect(veilleStub.calledOnce).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Error retrieving restart time:', mockError);
      expect(cron.schedule).not.toHaveBeenCalled();
    });
  });

  describe('scheduleReboot', () => {
    it('should execute the reboot command at the scheduled time', () => {
      const rebootHour = '02';
      const rebootMinute = '30';

      restartJob.scheduleReboot(rebootHour, rebootMinute);

      const scheduledFunction = cron.schedule.mock.calls[0][1];

      // Simulate the scheduled function being triggered
      scheduledFunction();

      expect(exec).toHaveBeenCalledWith('sudo reboot', expect.any(Function));
    });

    it('should handle exec errors correctly', () => {
      const mockError = new Error('Exec error');
      exec.mockImplementationOnce((cmd, cb) => cb(mockError, null, null));

      const rebootHour = '02';
      const rebootMinute = '30';

      restartJob.scheduleReboot(rebootHour, rebootMinute);

      const scheduledFunction = cron.schedule.mock.calls[0][1];

      // Simulate the scheduled function being triggered
      scheduledFunction();

      expect(console.error).toHaveBeenCalledWith(`Error executing reboot command: ${mockError.message}`);
    });

    it('should handle stderr correctly', () => {
      const mockStderr = 'Permission denied';
      exec.mockImplementationOnce((cmd, cb) => cb(null, null, mockStderr));

      const rebootHour = '02';
      const rebootMinute = '30';

      restartJob.scheduleReboot(rebootHour, rebootMinute);

      const scheduledFunction = cron.schedule.mock.calls[0][1];

      // Simulate the scheduled function being triggered
      scheduledFunction();

      expect(console.error).toHaveBeenCalledWith(`Error output from reboot command: ${mockStderr}`);
    });
  });

  describe('EventEmitter - updateSchedule', () => {
    it('should update the schedule when the updateSchedule event is emitted', () => {
      const newTime = '04:45';
      const [newHour, newMinute] = newTime.split(':');

      restartJob.start(); // Starts the event listener

      // Emit the updateSchedule event
      sharedEmitter.emit('updateSchedule', newTime);

      expect(cron.schedule).toHaveBeenCalledWith(`${newMinute} ${newHour} * * *`, expect.any(Function), {
        scheduled: true,
        timezone: 'Europe/Paris'
      });
    });

    it('should log updated data when the "updated" event is emitted', () => {
      const updatedData = { key: 'value' };

      // Spy on console.log to verify the data is logged
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Emit the 'updated' event
      sharedEmitter.emit('updated', updatedData);

      // Check that the console.log was called with the updated data
      expect(consoleLogSpy).toHaveBeenCalledWith('RSCOM updated:', updatedData);

      // Restore the console.log spy
      consoleLogSpy.mockRestore();
    });
  });
});
