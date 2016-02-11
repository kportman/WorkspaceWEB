package app;

import java.lang.reflect.Type;
import java.util.Collection;

/**
 * A simple place to hold global application constants
 */
public interface AppConstants {

	//public final String CUSTOMERS = "customers";
	//public final String CUSTOMERS_FILE = CUSTOMERS + ".json";
	public final String NAME = "name";
	//public final Type CUSTOMER_COLLECTION = new TypeToken<Collection<Customer>>() {}.getType();
	//derby constants
	public final String DB_NAME = "AppDB";
	public final String DB_DATASOURCE = "java:comp/env/jdbc/AppDatasource";
	public final String PROTOCOL = "jdbc:derby:"; 
	//sql statements//
	
	//create statements:
	
	public final String CREATE_USER_TABLE2 = "CREATE TABLE USER(USERNAME varchar(10) PRIMARY KEY,PASSWORD varchar(8),NICKNAME varchar(8),DESCRIPTION varchar(50),PHOTOLINK varchar(300))";
	
	public final String CREATE_USER_TABLE="CREATE TABLE USERS("
			+ "U_USERNAME VARCHAR(10) CHECK (U_USERNAME <> '') PRIMARY KEY,"
			+ "U_PASSWORD VARCHAR(8) NOT NULL CHECK (U_PASSWORD <> ''),"
			+ "U_NICKNAME VARCHAR(20) NOT NULL CHECK (U_NICKNAME <> ''),"
			+ "U_DESCRIPTION VARCHAR(2048),"
			+ "U_PHOTO_LINK VARCHAR(255),"
			+ "UNIQUE (U_NICKNAME))";
	
	//insert statements:
	
	public final String INSERT_USER_STMT = "INSERT INTO USERS VALUES(?,?,?,?,?)";
	
	public final Boolean CREATE_DB = false;// Initialize to true only if data base is new, Otherwise - set to false
	
	//public final String SELECT_ALL_CUSTOMERS_STMT = "SELECT * FROM CUSTOMER";
	//public final String SELECT_CUSTOMER_BY_NAME_STMT = "SELECT * FROM CUSTOMER "
	//		+ "WHERE Name=?";
}
