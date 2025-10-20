const enum FrontEndCommand
{
    UsersMes = 7777,
    Settings  = 8888, // DATA

    LoginView = 100,
    LoginUser = 101,       // CMD + DATA
    StorageFull = 102,      // ERR

    MainScreenView = 110,
    LogoutUser = 112,      // CMD

    BootView = 120,
    BoxView = 130,
    MeasurementSingleView = 140,
    MeasurementMultiView = 150,

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
    OscDataType,
}
