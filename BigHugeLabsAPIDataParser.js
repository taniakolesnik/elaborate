const BigHugeLabsAPIDataParser = (data) => {

    // Split the data into lines
    const lines = data.split('\n');
    // Extract the value after the second pipe
    const list = lines.map(line => {
        const parts = line.split('|');
        return parts[2]; // Value after the second pipe
    });
    return list;

}
export default BigHugeLabsAPIDataParser;

 


