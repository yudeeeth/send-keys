// ~ Boilerplate/modules
// #region
const express = require('express');
const app = express()
const fs = require("fs");
const ks = require("node-key-sender");
app.use(express.json({
    limit: '50mb'
}));
app.listen(9009,()=>{
    console.log("Server started on port 9009.");
});
// #endregion

// ~ keycodes
// #region
let mapping = [
    {
        id:1,
        name:"copy",
        code:["control", "c"],
        img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAACHElEQVR4nO3cTW7TQByG8YcPpQsQZ2BfcgrgJPQ8FSAKd+GjZ0CCE3AEkmUqWKRCbKiHeDzvJPP8JO+cxv4/jdPE6oAkSZKk0dw74DFr4AJ4DjwFHlU9ov4cMqNFnAHvgRvg10BbF86Aa/LDGDbAB/KDOMkAJde3NfAVuL/wsfRq0feAkqFeFO6nA5QM9sXiRzGwkpfXBni89IF0bNFLUMkPn3oj6ubv5GPktT3MAGEGCDNAmAHCDBBmgLBEgDXwBvgObMl/2TZ3296ey2vgWcU5/VHr28IR7ifcAFfA6j/mMqlGgNHuJ3yhYoQaAUa8n/CucDaT5gZYc9qXnX9tO+B8ajgt3oRHvZ/wAHg1tVOLwYx8P+Hl1A4tvo4e+X7CBnhy1w4tAsx9fO9mnd+I1+auGCDMAGEGCDNAmAHCDBBmgDADhBkgzABhBggzQJgBwgwQZoAwA4QZIMwAYQYIM0CYAcIMEGaAMAOEGSDMAGEGCDNAmAHCDBBmgDADhBkgzABhBggzQJgBwgwQ9rBgn2P/P96u+QoIM0CYAcIMEGaAMAOEGSCs5HPAXFvuXrCpZN25Y/VzaocWr4AfDZ6jV5Pn3iLApwbP0auP6QOA/XK+O/LLSHa5bGUrV+QH0np7W2VylazYL+ebHkqr7TOV14+uYcV+Od9Tvhzt2P/mdzf8v50Dl8A39utqpoc2d9vcnsslHV3zJUmSJPXrN5F0MzFuBeQ1AAAAAElFTkSuQmCC"
    },
    {
        id:2,
        name:"paste",
        code:["control", "v"],
        img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAC00lEQVR4nO3dzWoTYRjF8b8fpBvrorZ+FLfioq23IOjWIlLEhUsRvJqiYi3uRHAjXoFW8Rr8ALGu6kIQi7YJIiUhLmZSQgxJ5p3JezKT84MHSsN0nvc5yTBJygyYmdm0OqJuIKNF4DZwGbgEnEp/vwu8B94Bz4Hvku4q7BzwDDgA2kPqAHgKnJV0WkHXgd8MH3xv/QJWBf1Wyj2gRfbhd6oF3I3edUWsAk3Ch9+pJnAtcu+lNw/8IP/wO/UTOB11BSX3hOKG36nNqCsosQXgD8UH8Bc4E3Ed0awAD4CPQIPiB9evdoA1YDatG8DnSPtupGu9DywXML9gM8Bj8p2lhA5/rk8/c8C3yL20gA2gFjC/XGaAtzkaz1NrA/q6KerpDZFD2BzDIkat2QF9nRT29SjD/HJZIf5hp7s6n//0My/sqwksjTzF1NGsGwB3ArcrypUBj12N1sX/jpHMZuw+oXuWtYEvJM/0XgvAtri3DxlnGWRftLju2gZukXw8vZj+/HUC+trPOsyQ7wPaOf/msO3V8vafaabKY7nhAOQcgJgigLpgn6Pai71DRQBbgn2OapJ7OzTsVGyYiyT/xaA+ZeytXeBChPXnVkQD54EXJC959eD3gJeMNvyi1n9I8T6g7Pw+oEocgJgDEHMAYg5AzAGIOQAxByDmAMQcgJgDEHMAYg5AzAGIOQAxByDmAMQcgJgDEHMAYg5AzAGIOQAxByDmAMQcgJgDEHMAYg5AzAGIOQAxByDmAMQcgJgDEHMAYg5AzAGIOQAxByDmAMQcgJgDEHMAYg5AzAGIOQCx4wHbNIATAx6f9OuCjlPmC7eGvAJ2AraZFplnExLA64BtpsWrGDtZppjbS1Wtgi5fH2ojwoLKVg9zTTSjGsltO9SLnpTaQnAfmRrJbTum+XDUJHnmRx9+tyVgneTmBXX0Qxl31dO1rhPxmG9mZmZmZmZmZuX3DwlV96U0rphjAAAAAElFTkSuQmCC"
    },
    {
        id:3,
        name:"transform",
        code:["control", "t"],
        img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAETUlEQVR4nO2bPWgUQRTHf3eJKGg0RDFCREUEUcRGENOI4EcVEIuIFqKVjcZCCxGMRkS0sLEUP1o1lpYGxEqLBAvFKiJBQRNNYS4BMTnPYmbduXF2d3Zv5m7v4h+G3M7OvH3vZd+b/8zOANwHFoBKTCkBh2keHEHoHGfTAnAPko0PyqN6WlAjHmNn00I70CY7fQZeGYT1y79thnt5RVH5/dRwvxdYj7Qp8MZwhLCk+3nEMKHesfeLEQ1M6NcEBtcVwrcEzA4zKeSzv3odizQOaEm0p2ir54hPhPH1SakP6l4rdervevQPYtwKizoHqG+AHuOtglibigjCYAPbdnnArGW7UjtwAjhGOM4HGVSN+RJw3Zl6/nEd8Z/vkNdqTgjyRpkIcteMMZ+EpJyweNFIersWuATsB94Bcw3UpQr9svR6kr8CuArMEL6WM7Juhadn9hLalQhfOWAJcBr4ojxDL9+Ai8BSx89OlQNcO6CAGGXGqTZ2Grggy7R2b1z2KTjSIZUDXIbAAWCUauPmgJtAp9KuU9bNaW1HpYxakSoEXGAH1V6vIMbdYWBTTL8e4C4wr/V9DuzyqK8zbEAYUOZfA3amkLMV4azfiozfsm6LQ32NyJID1gC3gJ9UG/4K2FuDLruBF5rMXwgnr0shx1sSXI7I2j80Jd/jNt4OAG+0Z8winL7Son8qBwzLcj6mTRtwFpjUlJoATuFnoaUoZU9oz5yUusSRuvOEdjnBoKZEMKQtc/WAGCzDPHQOZhG26JfETLANgQFaNASaLQmusujvnQq31DCYBasxO8AlEarFAd5gmtpWgLfAiFY3j/gY2RMjr0e20anwiJSp1pXwNIW2mQy1AWeAr5pSE8BJwiR4CBjT2qSZDI1JGUiZJ8mWBJ2vB6ThAQXgOPAhoo9pTP8g+5imw1l4QGQOqAcPqCBWX7cB54ApWd8F3JalS9ZNyTbbZB9vSSsOtiGQlQp3AENUb2AoybqOmH618ABv6wEmY4Ik2JfQtxu4IUt3Qts+zEkwyWl1Q955QCRMr2oWIhSFPcBLsvOA18A+B3p4Y4JxIVAPHjCEHQ+o63qAax5wUHlmbtYDrmhKuOYB46TnAZezGJJHHjAAbKeBPMD3klgjeIC39YA88ADnSTDLMJh3HlC3/QEbaYEPIy6wA3hGtROa5tOYy4+jB3HHA2pBQ/cHuF4PyIKG7g8IYLNB4js52CDhe4tMFA+4hr+pbWQIuHrFsqAbwQwLwB0EofmPPMBXDmgkInNAO+KA0VH+5dK9hE6YRWw//ehPR6fYjJgdBjRZzWeBTWXgCSSfrgrKA99aO8RD7GyaKWL/ZSUXi4+WsLZJP11VMJRmh8mmvyfJ0iyIqDkBxIJnMMfeo9Sb1hNM83Gf/VNxmKSsr8dNgDyfGjPpqyLTsbmWhe0b0Ey8INOhKT3GWwUmm6pyxKI+PF1EkIZygsASzeeApFNuZeDBH0q0CWdbJskdAAAAAElFTkSuQmCC"
    },
    {
        id:4,
        name:"release selection",
        code:["shift","a"],
        img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAB2klEQVR4nO3dQU7bQABG4VcadlD1Fg1H4ACIk9DLQJpjcAJoew64AKy7qrNqFrBIJRY0zCi2+Sf1+6RZZWTZftjCduSAJEmSJEmSJEnSayfAN+AeWAFPEx8r4A5YAPMe+7XoEFgC6wY2utWxZhNituM+3uoQ+N7ABu7LuGXgCMsGNmrfxmKnPf0PJ3ja2WWsgS+lnXtQmgB8ZYRz2gTMgIvSpJoAZ/3XZbLOSxM+VCykA476r8skdcCntybUBHgqfF6zjP9Zr/1TcwrSiAwQZoAwA4QZIMwAYQYIe49bDKX/k1s36nWOR0CYAcIMEGaAMAOEGSDMAGEtPGpMP0+IXqd4BIQZIMwAYQYIM0CYAcIMEGaAMAOEGSDMAGEGCDNAmAHCDBBmgDADhBkgzABhLTwT3vfvjvbiERBmgDADhBkgzABhBggzQNh7XAekv/vZNI+AMAOEGSDMAGEGCDNAmAHCaq4DOuD4jc8nfT+/4HdpQs0R8DjAikzVQ2lCTYCfA6zIVP0YYiFzfHXxLuMPFa8u/liaAPwCPgOnFXP1YglcD7WwGXBD/q9qX8YNI9zonLF5Jbuno+1jDVwy8l3mOXDF5mc7ugY2Oj26v/vikopzviRJkiRJkqbrGR5gq7X0gcbDAAAAAElFTkSuQmCC"
    },
    {
        id:5,
        name:"Eraser",
        code:["e"],
        img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAADpElEQVR4nO2cvWvVUBiHnyp+tTioWBWUQp3uUGdBEAcnnVzFybqIawcHFf8GEfQvEBxEHCooIgoWFxERPzatDmp70SLi2NYhHCgxJyc3OTmf7wPvFpL3Pr+Tc+9NTgKCIAiCIAiCIOTGmO8GemA3cAY4BQyAA8Aa8AN4C8wDD4A/vhpMlQngOvAbWDfUEJgDtnrpNEEOAq8wiy/XArDfQ79JMQMsMbp8VYvAtPOuE2EAfKe9fFVfgcOOe48eW/IlhBbYli8hjEBf8iWEBvQtX0KowZV8CaEC1/IlhA34ki8h4F9+1iGEIj/LEEKTn1UIocrPIoTQ5ScdQizykwwhNvlJhRCr/CRCiF1+1CGkIj/KEFKTH1UIM8Ay/mX1VYvApDVblkl15JdrAdjWRMjmRtrsMACekscykEPACvDSdyOK1KedqhoCO23I60ou005VnTXJ2dRIYXtmgOfkMe1UcdrnwXMe+aredbbYEpFf1E+TqD6moNynnY0Yl//bDmAAPAb2Wt5vrHwzbWAzABn5//PBtIGtAGTkVzPv4iA5/slqUivArg5eGyG/dvR1pYPXRsjI19drYLy9WjMiX19LwFR7tWZM8leB944/dCg1BI60V2vGNOevARcpTr8njj50KLVMz/KnqH8acRW4sGH7cYrr/77FJDHyJ4A3NQ2U5StyCKF3+VA8ga5rQE07OlKejnqfdgD2oH/8Xzfyy6R4JjgZ+QCzNU3UjfwyKYXgTD7APU0Td1vsK4UQnMoH+Khp5GjL/cUcgnP5UFxUKjeyRrdXvcQYghf5UNxWq2poe8f9xhSCN/mgv6xwwsK+YwjBq3yAOxVNrQMPLe0/5BC8ywc4h77Bq5aOEWIIQciHYnndEH2jly0dJ6QQgpGvmKO+YVt3f0K4bOHk8sKobAGekX4IQcpXTFI8fFD3AWKejoKbdqqYAj6R3pkQ9Mgvk1oIUclXpBJClPIVsYcQtXxFrCEkIV8RWwhJyVfEEkKS8hWhh5C0fEWoIWQhXzENfKFeiM1/zKZlkFH8w7WNqzPhPMXSGBn5FfQdgshvQF8hiPwRsB2CyG+BrRBEfgea/Dq6hv7h5kvUy8/y186oNAnhEXCS4l70OHAc/fJIkd+CJiGEWivATWCHdSuOiTmEdeC2fSXumcZ8jznU+kv/71pywj7gBf6FZhsAFC8OnAU+419s07rViwnPjAHHKJY73qd6Wbzv+gXcIIEvYUEQBEEQBEEQ/PEPgoezZTPyH6MAAAAASUVORK5CYII="
    },
    {
        id:6,
        name:"Brush",
        code:["b"],
        img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QA/wD/AP+gvaeTAAAE2ElEQVRogd3beahUZRjH8c/VXNPMxEwlzcxswQtaf5S0mUiLGFoUGWJBYUUUgUSlSUJBJFi2oFFgSZsFURRJG1ZoUVHJxVYzTFrJFlxy6ead/njOcEa5XmbuvOPM9QvDhZnz/u7vOee873nf531Ok65NE8bjVAzDVmzGGuyoo6/k9MBcfI9CO59/8TTG1stgSsZgnTy4H/A87sdSrEVr9tsezKmPzTScgJ9EMBsxFd3aOW44HkdbduyCg2UwJQNFkAW8g8PLaDNTXO02XFI7a+nphlUi2E/Rt4K2t2btNom+3yW4V5j+HSMqbNsNLVn72Yl91YQZ4pZsxfmd1LheBLwylalacTK2CbNzq9AZk2lsTmGqVvTHl8Loc1Vq9ct0tlZrqlY04RVhskV5I3JHHKnBA14gDP6J4xPonZXpfZxAKzlTsRf/4cJEmg+JgB9IpJeMMfhbmLszkeax4lYuoDmRZhL6Yb0w9pLox9XSG+9mmi8m0EtGkzBUECNz/wSaA/BWpvkLhiTQTMYdwtg28eytlrH4KtP8Dack0EzGFDFA7cW0BHqXyScr6zAqgWYyRmKLMHd3lVpNuF2cuOJkpZJFRs3pI1Y+Bbym/XVtuRyFNzKtVhF4w/GkMLhBzIQ6S7M81bMFk6u3lp5pwuB2kYDrLDPxT6b1iXjmNiQn4n0xq+oMh2GxPK+1XDxzD0kG4W0N3l9TMV6kaorZj/Pqa6djLsWEKtpfjV0i2A9E4r1huVEY3YWLKmzbA4/K++sy9EzqLjFnioR40fAe5c+oBmN11m43rquFwZQcg5+F4cVYovygTxM5qIJIvp9RO5tp6IkPheHV4lHSJF+M73bgLOSc7PcC3sPRtTabgmXyTOHgku9Lg35wvza98IT89l8iTlTDc618kDr9AMdMtG9ybjg+ytrtxKxaGiyH3rgKK/CN/BFRvIqrcIvYwynejteUqX22WLcWt0TGpzReKb0wX76MK/fzVJn6N4v93IKYQQ1K6L1imvGtPIg1wuBEHJEdMwCjxUDzsvwRtF3Hj5E+4m4piK2UReiePIIKuECeOWgRud1yGIFn5SdpUTvHjMRn2e87cEW1ZqtlonzZtVznZjaz5H35rpLvJ8u7x3cYV5XTBAzEj8LQY6pLl04TK5q9ItC58nKE17P/VXeWCkNrpelT8+QTjWJ/vUd1KZ1kjBAjZitOSqTZHV/IN7OmJ9JNwkJh7JnEuhPEWJDqJCajWA40pd5GDgZHiP61U0w2DklKB47RYkTeKCYPhySlARdzw3/Uw8jBojTgQjvfpWSS2MW7uEb6ZVEa3K/Z31olx2ZgqDqP1KUBF2/lFHuz7VHMWLbUSL9ipsgXCqkZKiYzu8Xqqu5cLipmCmqTyZ+vgcoOpsvLbF+QPoc0RF5UMimxdqf4XJhZWAPtbmLvtyAKzRqCYoYi9WBVmp3cIhb9DUGx6HpmQs2+8qqcPTgnoXbV3CR/MeKGBHrN8lKGvzToQuQ+eQ7qVZ2rfBmER+QZjQ0a/K2SK8UVKV7tFThXx6N2L1EPuVKep27Fw6qr26gZ++erholy+9ny9M42kWHcJOqpiB2DcaKIrPgeQRvexG2imq5LMUoE/rWOk+1tIn0zTwONwh1RTkZymLiax9l3CblelPd1qVfe/gerbF0TKXuw/gAAAABJRU5ErkJggg=="
    },
    {
        id:7,
        name: "delete",
        code: ["delete"],
        img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAADEElEQVR4nO2azW7TQBCAPxAiEtBy4VcNvcErIBDcaXkCfs5cQH0feA4EbwAtSMAZEEhNKv5OqKFXONiRnJGd2dmdtRPiT7JkazOzs5Od2dm1oaenpycvA2AH2AUmwF/lmpS/fQKc7MBeVzaAD+iDbrrelzqWkgFpg59e71jSmbBD+uCn1+OWbXdhj9lBPCdsOg+BF0L2VSYbs3LI7CCGBtkrQva3u3Ulx3IppjA8pa9U+SCO51C6TMxzwF1gTHzikrQtP71GwNZ8N9QzSuh00a79pkGufAjMY4v/YxbsA3c8HLIrFN/yUOrEbWZtex0qaAmB7+L5kkE2N9IWaWsjFgf8EM8XDbK5kbZIWxvpHWDoxNsBWxQJagxsJ+q6IJ5/hgp26YBnFDX/BvA0UVcrM8A7CQ4b7mO4LJ6/hQqufA6wsM7sWntU85sbwEfgF/BA0afV/lUeUsT1p7IPyZHQta7oi0br6E2lbUJxLNZEqAMGwJ/K7/ZEe8gf04h1L6CFwbnK/Wlg06i/jk3gVOX5vGKDafp7O0AuPx55QiZbaUN0FQh2B2grgWz3cIDUYbVhLt4zIMdKYe2j0xDoHSCePXaMWg5o1QFajHeRA7T2uaTOAOu/E4N1lvUh4NBnI1rVtaa0VwmtBGX1eUZpXwsYRxLVsrSuHJbtTQaFOEBz+FmlXSXmWFyr9mR7ShhYCy1TAoQ4B2gx6LkSWHWb4z/GAVop6rkSWJPsQswAz5Ug+wrQh4BVoKaTnPuBrPsA8MkBi+SATnKA9cDCglX3QoaAfGlhQR5/yRoj+oVIClp1NmD2i1B5iDklpBJ8W2mvO2Rt7TRYonV8n2ImNB1jQ5gDbgKfS133RFvSaXAqX0XnVyN0WN4L1HFNyH+J0BH9iUyOgw8rySsAxDvAI9OPK/ejCHltExaElwNiZsAjCieMynsrLgchJ2KEajqLccBLitfjsSRvhKDbGZCKywzok2Bk5zkOP60kl8HglwOuE7eWe9JpCCwCrYbAIXAQKZuDA4q9QqtssxjfErt9C9zT07N6/ANtw/7Uq0h8RQAAAABJRU5ErkJggg=="
    },
    {
        id:8,
        name: "enter",
        code: ["enter"],
        img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAB2klEQVRoge2avUoDQRSFP8VSKzEm8W2shAR8AR8jRuyE+AY+irYRrBSM4g8qWmotQddCC4lFbuKqu5iZuTM76B4Ytsjee85hfu9kocT/QRPoAi/AQKklkrMRysS2ovi81vFtoilEr0ALqCnmrgHrknuA557ZF5KWR462cHQ9cpAISdUjR1U4nj1yjMewb3zhmQ5AGASlkdhQGokNpZHYEIuRA+C4aBHfYbMhOsfE0iPOKI3EhiwjrpUdwINX1RNAo7K7B1YMeVUXCJ+VnbUom5gQlV0eVI2EqOzyoGokVGWnxV1uiFmoAj3gUEGLGky7dxG4lphTYMqSd05yPBnGqcyRReBK3r/BbYFYljwnhnHORiromQDYlVxbhnFORirAJXomNiVXH5g3jLU2soCOiVmGw2nUE+/AqkUeayPnqXe0Wt/SxA+9M4aBGkiAO2AP2AEelfKOMcnQupB3boG6tgBDOE32mMw4L7/pSV+kGZUNMb0MF2VG7fSbPqKcuesyhuoxvsrQxJGjKBtEWY/Y4O/XI4k8Q1462GJJnuM/Q9NGRpfIa8Hk2GOksZf1Y4PP66A2xe/cWagDG8AbQ625Hwx00D8Y+mq/fsLRYHhlOroeiqkF/6imhC0+AAqCXigdNgRpAAAAAElFTkSuQmCC"
    },
    {
        id:9,
        name:"undo",
        code:["control", "z"],
        img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAABmJLR0QA/wD/AP+gvaeTAAAClklEQVRoge3YTYhNYRjA8d8dQxORqSHla2xYyFCyslE2vpIFyVcWRJZqysaGIhsLC1sbSwsWLBQRshjFRtT4CuUzTGOMYWaweO+NMe655957zpx7r/nXU7fb7Xme/znnvud9XsYZp65pxpysm0iKDjzATxzLuJeq2Y4vgsxPPM62ncppxgm/RQrxPMumKmUGrhotU5dCK/HKv2XqTmgfvikuUzdCLTgjWqRuhObhjngyNS+0Fh/Fl6lZoRwOYVh5MpkK5Yp834qzWF9h3gHcyn/uwyB68CEfr/E0H28rrBGbDuFNX+5dqTR6cEXYLm3ElCRldhi5hckivuIS9lQjNxGnMhb5V3zCScwvR2YWbtZA81HRjyOYHEfofA00HDeeYUWUTBN+xLGuEdpxAzujfjQT12R/9cuN/VFSE4S55kcNNBo3hrApSgq2oLcGmo0bfWKsgAtxvwaajRsXSgnBVJyrosg3dONJPl7ic4pS6+JI5dAp7MPKLVBsc9qMNizBBhwQXujXhZdopUKX4wgVWCVsIJMQiiKHZcJFvKa8BWpYWNJjMxu3Uxb6mwU4Kv6dO1xugUk4HTN5kvPQdBzH9xI1y3rs/mSX0jvyNAa85XgYUfOj4vNdSZaKnpnSmlhbRT/6i6pNfrFI4jRH8CmKH9isrjZ54dxhyNgJwVy8N1poc1IF1ghnBYXE3UkljmC30UJ7kyzQjq584s4kExehCXeNFDqYRqFpaSQtwjYjhfaNYe1UaDHyEHRrU7b9VM2AcEJUoLfehQgjeYFPmXWRIIv9fuTaMu4lEVqE3fYbwnxS7wwIZ+WPCGt5I/BK2Lg2jFA/7tE4QgPCGN8wQi802H+oq/BhQpZdJMgg3mXdRJI0yo35D/gFfujBNjP1GMsAAAAASUVORK5CYII="
    },
    {
        id:10,
        name:"redo",
        code:["control", "shift" ,"z"],
        img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAABmJLR0QA/wD/AP+gvaeTAAACsklEQVRoge3Yy4uNcRzH8ZcZ9zu5k8RGKRYWNhaUhSLZkEvsyM6CkpUksqEsLPwDNspiwoZcclmgsCHTWEySKIzLkOuxeOYxF+ec53rmN8O861unzjnf5/P5/Z7n+3x/X4YY4r9iHoaHFlEWx1DBYywNrKUU2kSGKujEtrByitOu21AcZzAypKgiVDNUwS3MDqgrN7UMVfAaq8NJy0c9QxV8x4Fg6nKQZCiOsxgXSGMm0hqq4BEWhZGZniyGKniPjUGUpiSroQp+4TiaaiUd1gChM7GwK+ZgKqZhkugdEz8PKzE65zUuYgfeFVJahfHYIGpjrqBD9lXPG21KapnGYxcu4Us/GqgWndie18gCnNS/u5A2TmFEWiNjcUT43UiKm5iVZGaFfNUoVJyvWf6wE9cxP8n1AOJXrS/2CL/aWeMaZlQzs07UGIYWmCXOqFEUFuDTABCYNj5gUzUjMS0DQGTaeIol9cysb+DFP+I5nnVFK74WyHcOE6qZ6DlC2lvPbQIdeChq8592iW/Hy67vflT5T7vsFfQHDuKEyFhNFuKn9Cv0E1exD8vka3Kzvt9eYVXa5IdSJn2Lw6LiUZQshu5gbpbklxMSfsNRTC7u4w9pDZ2WcbTVpH7D+QTLy3DQhyRDnaIzT2YW10l6W7m70pN6htpEz2Yu1tRIeldjpy21DF3AlCKJN1dJ+kY5D349+hpKnBekZbe/DeW6dzPSqvcCri0r8T69zdxXwiqlYL/uW7vUu6HvUWFLmckTmNiIpFt1m+nAmEZcpL9oEk0kY1pEs4NBS5Pew7oboYSUyXTdt9ziwFpK47Wogx4VWkhR4vL8BC9Eh65BTXzAeyz/4HxAEe/QA3wOKaQsYkPXDfJyHRMbahXNAQY9PXu2e8FUlEhzj8/fReX7n6E5+SdDDFGU3wmTpVGZk0BuAAAAAElFTkSuQmCC"
    },
    
]

// #endregion

// ~ serving static files via GET selectively based on authoization
// #region
app.get('/*',async (req,res) => {
    if(req.path === '/' ) {
        res.sendFile(`index.html`, {root: __dirname + '/public'});
    }
    else if(req.path.split('.').length==1 ){
        if(!fs.existsSync(__dirname+'/public'+req.path+".html")){ res.sendFile('404.html', {root: __dirname + '/public'});}
        res.sendFile(`${req.path.slice(1)}.html`, {root: __dirname + '/public'});
    }
    else{
        if(!fs.existsSync(__dirname+'/public'+req.path)){ res.sendFile('404.html', {root: __dirname + '/public'});}
        res.sendFile(req.path.slice(1), {root: __dirname + '/public'});
    }
});

app.post('/send',(req,res)=>{
    ks.sendCombination(req.body.code);
    res.send('ok');
});

app.post('/map',(req,res)=>{
    res.json(mapping);
});

// #endregion