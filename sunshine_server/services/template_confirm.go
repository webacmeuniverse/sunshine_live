package services

import (
	"bytes"
	"text/template"
)

func GetConfirmEmailHTML(_data TemplateData) string {
	tmpl := template.Must(template.New("confirm").Parse(confirmEmailHTML))
	buf := new(bytes.Buffer)
	tmpl.Execute(buf, _data)
	return buf.String()
}

var confirmEmailHTML string = `
<!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>
</head>

<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
    <!-- HIDDEN PREHEADER TEXT -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account.
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->

		<tr>
            <td bgcolor="#F2F4F6" align="center" style="padding: 40px 10px 40px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td  >
                           <center> <img src="https://www.savehomesave.eu/static/media/1SUNShiNE_Main_footer.c9beb0308a10b107f35b.png" width="250" height="120" style="display: block; border: 0px;" />
                       </center>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>

        <tr>
            <td bgcolor="white" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding:10px 30px 10px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <h1 style="font-size: 28px; font-weight: 400; margin: 2;font: small/1.5 Arial,Helvetica,sans-serif;color: #2f3133;font-size: 19px;font-weight: bold;">Hi {{ .Name }},</h1>
							<p style="margin: 0;color: #74787E;font-size: 12px;font: small/1.5 Arial,Helvetica,sans-serif;line-height: 1.5em;">Welcome to Sunshine! We're very excited to have you on board.</p>

                        </td>
                    </tr>
					<tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 10px 30px 10px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;color: #74787E;font-size: 12px;line-height: 1.5em;font: small/1.5 Arial,Helvetica,sans-serif;">Click the button below to confirm your account. This validation link expires in 48 hours:</p>

                        </td>
                    </tr>
					 <tr>
                        <td bgcolor="#ffffff" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 30px 30px 30px 30px;">
									<table cellpadding="0" cellmargin="0" border="0" height="44" width="178" style="border-collapse: collapse; border:5px solid #c62228">
									  <tr>
										<td bgcolor="#c62228" valign="middle" align="center" width="174">
										  <div style="font-size: 18px; color: #ffffff; line-height: 1; margin: 0; padding: 0; mso-table-lspace:0; mso-table-rspace:0;">
												<a href={{ .Link }} target="_blank" style="text-decoration: none; color: #ffffff; border: 0; font: small/1.5 Arial,Helvetica,sans-serif; mso-table-lspace:0; mso-table-rspace:0;" border="0">Confirm your account</a>
										 </div>
										</td>
									  </tr>
									</table>
									
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr> <!-- COPY -->
                    
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 10px 30px 10px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;color: #74787E;font-size: 12px;line-height: 1.5em;font: small/1.5 Arial,Helvetica,sans-serif;">Data Privacy</p>
                        </td>
                    </tr> <!-- COPY -->
                     <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 10px 30px 10px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;color: #74787E;font-size: 12px;line-height: 1.5em;font: small/1.5 Arial,Helvetica,sans-serif;">You have received this email because you would like to register to the SunSHiNE Platform.</p>
                        </td>
                    </tr> <!-- COPY -->
					<tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 10px 30px 10px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;color: #74787E;font-size: 12px;line-height: 1.5em;font: small/1.5 Arial,Helvetica,sans-serif;">The information transmitted is intended for the person or entity to which it is addressed and may contain confidential, privileged or copyrighted material. If you receive this in error, please contact the sender and delete the material from any computer.</p>
                        </td>
                    </tr>
					<tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 10px 30px 10px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;color: #74787E;font-size: 12px;line-height: 1.5em;font: small/1.5 Arial,Helvetica,sans-serif;">We work hard to keep your personal data secure, which includes regularly reviewing our privacy notice. When there’s an important change we’ll remind you to take a look, so you’re aware how we use your data and what your options are. Please review the latest privacy notice.</p>
                        </td>
                    </tr>

                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;color: #74787E;font-size: 12px;line-height: 1.5em;font: small/1.5 Arial,Helvetica,sans-serif;">Yours truly,<br>Sunshine</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="white" align="center" style="padding: 10px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;border-top: 1px solid #edeff2;">
                    <tr>
                        <td bgcolor="white" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">

                            <p style="margin: 0;color: #74787E;font-size: 12px;text-align: left;line-height: 1.5em;font: small/1.5 Arial,Helvetica,sans-serif;">If you’re having trouble with the button 'Reset your password', copy and paste the URL below into your web browser. <br><br><a href="#" target="_blank" style="font: small/1.5 Arial,Helvetica,sans-serif;">{{ .Link }}</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
       <tr>
            <td bgcolor="#F2F4F6" align="center" style="padding: 40px 10px 40px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td  >
                                                    <p style="margin: 0;color: #74787E;font-size: 12px;line-height: 1.5em;    text-align: center;font: small/1.5 Arial,Helvetica,sans-serif;">Copyright @ 2023 Sunshine. All rights reserved</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>
`
