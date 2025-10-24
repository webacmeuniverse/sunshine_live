import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    Checkbox,
    Grid,
} from '@material-ui/core';

import Input from '../Input';
import GDPRUploads from './GDPRUploads';

function ExtractGDPRData(props) {
    const { data, setData } = props;
    const { t } = useTranslation('privacy');

    return (
        <div>
            <h3 style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '18px'}}>{t('appendix_5.h3_147')}</h3>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>
                <b>{t('appendix_5.p_147_code_1')} </b>
                <b>{t('appendix_5.p_147_code_3')} </b>
                {t('appendix_5.p_147')}
            </p>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_148')}</p>
            <h3 style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '18px'}}><strong>{t('appendix_5.p_149_strong_1')}</strong></h3>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_150')}</p>
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Input
                            label={t('appendix_5.ul_89_li_1')}
                            value={data.requesterName}
                            onChange={e => setData({ ...data, requesterName: e.target.value })}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            label={t('appendix_5.ul_89_li_2')}
                            value={data.requesterAddress}
                            onChange={e => setData({ ...data, requesterAddress: e.target.value })}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            label={t('appendix_5.ul_89_li_3')}
                            value={data.requesterPhone}
                            onChange={e => setData({ ...data, requesterPhone: e.target.value })}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            label={t('appendix_5.ul_89_li_4')}
                            value={data.requesterEmail}
                            onChange={e => setData({ ...data, requesterEmail: e.target.value })}
                            required
                        />
                    </Grid>
                </Grid>
            </div>
            <h3 style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '18px'}}><strong>{t('appendix_5.p_152_strong_1')}</strong></h3>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_153')}</p>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_154')}</p>
            <div>
                <FormControl>
                    <RadioGroup value={data.subject} onChange={e => setData({ ...data, subject: e.target.value })}>
                        <FormControlLabel value="self" control={<Radio />} style={{fontSize: '11px !important',fontWeight: '700 !important',lineHeight: '1.66 !important',letterSpacing: '0.03333em !important',color: 'rgb(0 0 0 / 87%)'}} label={t('appendix_5.p_155_code_1')} />
                        <FormControlLabel value="else" control={<Radio />} style={{fontSize: '11px !important',fontWeight: '700 !important',lineHeight: '1.66 !important',letterSpacing: '0.03333em !important',color: 'rgb(0 0 0 / 87%)'}}  label={t('appendix_5.p_155_code_2')} />
                    </RadioGroup>
                </FormControl>
            </div>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_155')}</p>
            <ul style={{listStyle: 'disc',marginLeft: '30px',fontSize: '11px !important',fontWeight: '700 !important',lineHeight: '1.66 !important',letterSpacing: '0.03333em !important',color: 'rgb(41 38 38 / 87%)'}}>
                <li>{t('appendix_5.p_156_code_1')}</li>
                <li>{t('appendix_5.p_156_code_3')}</li>
            </ul>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_156')}</p>
            <div>
                <GDPRUploads
                    onDropAccepted={fs => setData({ ...data, files: fs })}
                    files={data.files}
                />
            </div>
            <h3 style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '18px'}}>{t('appendix_5.h3_157')}</h3>
            {
                data.subject === 'self' ?
                    <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_300')}</p> :
                    <div>
                        <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_158')}</p>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Input
                                    label={t('appendix_5.ul_89_li_1')}
                                    value={data.name}
                                    onChange={e => setData({ ...data, name: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label={t('appendix_5.ul_89_li_2')}
                                    value={data.address}
                                    onChange={e => setData({ ...data, address: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label={t('appendix_5.ul_89_li_3')}
                                    value={data.phone}
                                    onChange={e => setData({ ...data, phone: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label={t('appendix_5.ul_89_li_4')}
                                    value={data.email}
                                    onChange={e => setData({ ...data, email: e.target.value })}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </div>
            }
            <h3 style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '18px'}}>{t('appendix_5.h3_160')}</h3>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_161')}</p>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_162')}</p>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_163')}</p>
            <div>
                <Input
                    label={t('appendix_5.ul_89_li_6')}
                    value={data.reason}
                    onChange={e => setData({ ...data, reason: e.target.value })}
                    multiline
                    rows={2}
                    required
                />
            </div>
            <h3 style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '18px'}}>{t('appendix_5.h3_164')}</h3>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_165')}</p>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_166')}</p>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_168')}</p>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_169')}</p>
            <div>
                <Input
                    label={t('appendix_5.p_165')}
                    value={data.information}
                    onChange={e => setData({ ...data, information: e.target.value })}
                    multiline
                    rows={2}
                    required
                />
            </div>
            <h3 style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '18px'}}>{t('appendix_5.h3_171')}</h3>
            <p style={{display:'block',marginBlockStart: '1em',marginBlockEnd: '1em',marginInlineStart:'0px',marginInlineEnd: '0px',fontSize: '10px',fontWeight: '600',lineHeight: '1.66',letterSpacing: '0.03333em',color: 'rgb(59 56 56 / 87%)'}}>{t('appendix_5.p_172')}</p>
            <div>
                <FormControlLabel style={{fontSize: '11px !important',fontWeight: '700 !important',lineHeight: '1.66 !important',letterSpacing: '0.03333em !important',color: 'rgb(0 0 0 / 87%)'}}
                    control={
                        <Checkbox
                            checked={data.confirm}
                            onChange={() => setData({ ...data, confirm: !data.confirm })}
                        />
                    }
                    label={t('appendix_5.p_173')}
                />
            </div>
            <p style={{fontSize: '11px !important',fontWeight: '700 !important',lineHeight: '1.66 !important',letterSpacing: '0.03333em !important',color: 'rgb(0 0 0 / 87%)'}}>{t('translations:utils.hint')}</p>
        </div>
    );
}

export default ExtractGDPRData;
