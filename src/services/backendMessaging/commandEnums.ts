const enum FrontEndCommand
{
    UsersMes = 7777,
    Settings  = 8888, // DATA

    LoginView = 100,
    LoginUser = 101,       // CMD + DATA
    StorageFull = 102,      // ERR

    MainScreenView = 110,
    LogoutUser = 112,      // CMD

    PackagingView = 120,

    BoxedView = 130,
    DeleteBox = 131,   // DATA intArray = [id]

    OrdersView = 140,
    AddOrder = 141,         // DATA intArray = [orderID, KitTypeInt1 (front), KitTypeInt2 (back), TotalAmount]
    DeleteOrder = 142,      // DATA intArray = [id, orderID]
    SelectOrder = 143,      // DATA intArray = [id, orderID]
    Scanner = 144,          // CMD + DATA
    ScannerQR = 145,        // DATA (only when full Set of Data arrives!)

    StockView = 150,

    ShutDown = 9999,        //CMD
    Stop = 1111, 
    Instructions = 3333, // DATA as string

}

const enum BackEndCommand
{
   
    InitPackaging = 200,
    PrinterConnected = 201,
    BarCodeScannerConnected = 202,
    OrderSelected = 203,

    Softcase = 210,        // CMD + ACK/NACK    
    
    Stickers = 220,        // CMD + ACK/NACK
    YCharger = 230,        // CMD + ACK/NACK (1 / 2)
    UsbACharger = 240,     // CMD + ACK/NACK (1)
    Hoofpick = 250,        // CMD + ACK/NACK

    Boots = 260,           // DATA + ACK (2/4)
    RfidResult = 261,      // DATA + ERR

    PasternWrap = 270,     // CMD + ACK/NACK (2/4)
    Manual = 280,          // CMD + ACK/NACK
    Banderole = 290,       // CMD + ACK/NACK

    Label = 300,
    GenerateSerial = 301,
    ScanLabel = 302,

    StoreResult = 310,
    SafetyRegulationBooklet = 320,   // CMD + ACK/NACK

    Version = 330,
    
    Resetting = 1111,

}


const enum OscDataType{
    None = -1,
    String = 0,
    Float = 1,
    Int = 2,
    Bool = 3,
}

export {
    FrontEndCommand,
    BackEndCommand,  
    OscDataType,
}
