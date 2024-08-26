const { Volleyball, Handball, Floorball, IceHockey, RinkHockey, Futsal, Netball, Basketball, Tennis, Badminton, TableTennis, Training, FreeSport } = require('../Utils/Enums/eSport');


// 0x1x frames
// Using Volleyball display
const Frame_0x10 = require('./Frame_0x10_Volleyball.js'); // Volleyball

// 0x2x frames
// Using Handball display
const Frame_0x20 = require('./Frame_0x20_Handball.js'); // Handball
const Frame_0x21 = require('./Frame_0x21_Floorball.js'); // Floorball
const Frame_0x22 = require('./Frame_0x22_Ice_Hockey.js'); // IceHockey
const Frame_0x23 = require('./Frame_0x23_Rink_Hockey.js'); // RinkHockey
const Frame_0x24 = require('./Frame_0x24_Roller_Hockey.js'); // RollerInlineHockey
const Frame_0x25 = require('./Frame_0x25_Futsal.js'); // Futsal
const Frame_0x26 = require('./Frame_0x26_Netball.js'); // Netball
const Frame_0x27 = require('./Frame_0x27_Boxe.js'); // Boxe


// 0x3x frames
// Using Basketball display
const Frame_0x30 = require('./Frame_0x30_Basketball.js'); // Basketball

const Frame_0x37 = require('./Frame_0x37_Basketball_Guest.js'); // Basketball Individual Guest Points
const Frame_0x38 = require('./Frame_0x38_Basketball_Home.js'); // Basketball Individual Home Points


// 0x4x frames
// Using Tennis display
const Frame_0x40 = require('./Frame_0x40_Tennis.js'); // Tennis
const Frame_0x41 = require('./Frame_0x41_Badminton.js'); // Badminton
const Frame_0x42 = require('./Frame_0x42_Table_Tennis.js'); // TableTennis

// 0x5x frames
// Using Handball display (TODO: make a Standard display)
const Frame_0x50 = require('./Frame_0x50_Simple_Timer.js'); // Chrono
const Frame_0x51 = require('./Frame_0x51_Training.js'); // Training
const Frame_0x52 = require('./Frame_0x52_Free_Sport.js'); // FreeSport

// 0x9x frames
// Utilitary frames
const Frame_0x34 = require('./Frame_0x34_Radio_Channel.js'); // Radio Channel Settings
const Frame_0x90 = require('./Frame_0x90_Team_Names.js'); // TeamNames
const Frame_0x91 = require('./Frame_0x91_Clear_Name.js'); // Clear TeamNames
const Frame_0x92 = require('./Frame_0x92_Full_Clear.js'); // Full Clear
const Frame_0x93 = require('./Frame_0x93_Test_Mode.js'); // Test Mode
const Frame_0x94 = require('./Frame_0x94_QR_Mode.js'); // QR Code
const Frame_0x99 = require('./Frame_0x99_Clock.js'); // Reserved for Clock Setup
const Chrono = require('../Utils/Frame_Tools/4_7_Chrono');
const TeamName = require('../Utils/Frame_Tools/6_48_TeamName');

module.exports = Frames = {
    // 0x1x frames
    Volleyball: Frame_0x10, // Volleyball

    // 0x2x frames
    Handball: Frame_0x20, // Handball
    Floorball: Frame_0x21, // Floorball
    IceHockey: Frame_0x22, // IceHockey
    RinkHockey: Frame_0x23, // RinkHockey
    RollerInlineHockey: Frame_0x24, // RollerInlineHockey
    Futsal: Frame_0x25, // Futsal
    Netball: Frame_0x26, // Netball
    Boxe: Frame_0x27, // Boxe

    // 0x3x frames
    Basketball: Frame_0x30, // Basketball
    _0x37: Frame_0x37, // Basketball Individual Guest Points
    _0x38: Frame_0x38, // Basketball Individual Home Points

    // 0x4x frames
    Tennis: Frame_0x40, // Tennis
    Badminton: Frame_0x41, // Badminton
    TableTennis: Frame_0x42, // TableTennis

    // 0x5x frames
    Chrono: Frame_0x50, // Chrono
    Training: Frame_0x51, // Training
    FreeSport: Frame_0x52, // FreeSport

    // 0x9x frames
    RadioChannel: Frame_0x34, // Radio Channel Settings
    TeamNames: Frame_0x90, // TeamNames
    ClearTeamNames: Frame_0x91, // Clear TeamNames
    FullClear: Frame_0x92, // Full Clear
    Test: Frame_0x93, // Test Mode
    QR: Frame_0x94, // QR Code
    ClockSetup: Frame_0x99, // Reserved for Clock Setup
}
