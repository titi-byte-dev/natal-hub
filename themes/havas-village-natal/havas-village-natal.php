<?php
namespace Grav\Theme;

use Grav\Common\Config\Config;
use Grav\Common\Grav;
use Grav\Common\Page\Page;
use Grav\Common\Page\Pages;
use Grav\Common\Theme;
use Grav\Common\Twig\Twig;
use Grav\Common\Uri;
use Grav\Framework\File\File;
use Grav\Framework\File\Formatter\YamlFormatter;
use Grav\Framework\File\YamlFile;
use Grav\Framework\Flex\Flex;
use Grav\Framework\Flex\FlexDirectory;
use Grav\Framework\Flex\Interfaces\FlexObjectInterface;
use Grav\Framework\Form\FormFlash;
use Grav\Plugin\Email\Utils as EmailUtils;
use Grav\Plugin\Form\Form;
use RocketTheme\Toolbox\Event\Event;
use RocketTheme\Toolbox\ResourceLocator\UniformResourceLocator;
use Swift_RfcComplianceException;

class HavasVillageNatal extends Theme
{
    public static function getSubscribedEvents()
    {
        return [
            'onThemeInitialized'  => ['onThemeInitialized', 0],
            'onTwigInitialized'   => ['onTwigInitialized', 0],
            'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
            'onFormProcessed'     => ['onFormProcessed', 0]
        ];
    }

    public function onThemeInitialized()
    {
        /** @var Uri $uri */
        $uri = $this->grav['uri'];

        if ('/grid' === $uri->path()) {
            $this->enable([
                'onPagesInitialized' => ['addGridPage', 0]
            ]);
        }

        if ('/submit_like' === $uri->path()) {
            $this->submit_like($uri);
        }

        if ('/send_email' === $uri->path()) {
            $this->send_email($uri);
        }
    }

    /**
     * Add current directory to twig lookup paths.
     */
    public function onTwigTemplatePaths()
    {
        $this->grav['twig']->twig_paths[] = __DIR__ . '/templates';
    }

    public function send_email($uri)
    {
        /** @var Twig $twig */
        $twig = $this->grav['twig']->init();
        $post = $uri->post();
        $email = strtolower($post['email']);
        $code = rand(10000, 99999);

        if (empty($email)) {
            throw new \RuntimeException('Email não preenchido');
        }

        $subject = 'Confirma o teu email';
        $body = $twig->processTemplate('partials/email.html.twig', ['code'=>$code]);
        $to = $email;

        try {
            $sent = EmailUtils::sendEmail($subject, $body, $to);
        } catch (\RuntimeException | Swift_RfcComplianceException $e) {
            header('Content-Type: application/json');
            echo json_encode(['type'=>'error', 'message'=>'Email incorreto, por favor tente novamente.']);
            exit();
        }

        if ($sent < 1) {
            header('Content-Type: application/json');
            echo json_encode(['type'=>'error', 'message'=> 'Email não enviado, tente novamente.']);
            exit();
        }

        $yaml = new YamlFile('user-data://voting/confirmation.yaml',  new YamlFormatter(['inline' => 4]));
        $array = $yaml->load();
        $array[$email] = $code;

        try {
            $yaml->save($array);
        } catch (\RuntimeException $e) {
            header('Content-Type: application/json');
            echo json_encode(['type'=>'error', 'message'=>'Ocorreu um erro, tente novamente.']);
            exit();
        }

        header('Content-Type: application/json');
        echo json_encode(['type'=>'success', 'message'=>'Para terminar, escreve aqui o código que te enviámos por email.']);
        exit();
    }

    public function submit_like($uri)
    {
        $post = $uri->post();
        $email = strtolower($post['email']);
        $sent_code = $post['code'];
        $id = $post['id'];

        $yaml = new YamlFile('user-data://voting/confirmation.yaml',  new YamlFormatter(['inline' => 4]));
        $array = $yaml->load();
        $code = $array[$email] ?? false;

        if (!$code) {
            header('Content-Type: application/json');
            echo json_encode(['type'=>'error', 'message'=>'Ocorreu um erro, tente novamente.']);
            exit();
        }

        if ($sent_code !== strval($code)) {
            header('Content-Type: application/json');
            echo json_encode(['type'=>'error', 'message'=>'Código Inválido.']);
            exit();
        }

        /** @var Flex $flex */
        $flex = $this->grav['flex'];

        /** @var FlexDirectory $dir */
        $dir = $flex->getDirectory('contacts');
        $obj = $dir->getObject($id);

        if (!$obj) {
            header('Content-Type: application/json');
            echo json_encode(['type'=>'error', 'message'=>'Ocorreu um erro, tente novamente.']);
            exit();
        }

        if ($obj->getProperty('email') === $email) {
            header('Content-Type: application/json');
            echo json_encode(['type'=>'error', 'message'=>'Podes votar em todas as árvores do Village menos na tua.']);
            exit();
        }

        try {

//            unset($array[$email]);
//            $yaml->save($array);

            $yamlvotes = new YamlFile('user-data://voting/votes.yaml',  new YamlFormatter(['inline' => 4]));
            $votes = $yamlvotes->load();

            if (isset($votes[$email][$id])) {
                header('Content-Type: application/json');
                echo json_encode(['type'=>'error', 'message'=>'Só podes votar uma vez em cada árvore do Village.']);
                exit();
            } else {
                if (isset($votes[$email]) && is_countable($votes[$email]) && count($votes[$email]) >= 3) {
                    header('Content-Type: application/json');
                    echo json_encode(['type'=>'error', 'message'=>'Já esgotaste os teus três votos disponíveis.']);
                    exit();
                }
                $votes[$email][$id] = 1;
            }

            $yamlvotes->save($votes);

            $likes = $obj->getProperty('likes') + 1;

            $obj->setProperty('likes', $likes);
            $obj->save();

        } catch (\RuntimeException $e) {
            header('Content-Type: application/json');
            echo json_encode(['type'=>'error', 'message'=>'Ocorreu um erro, tente novamente.']);
            exit();
        }

        header('Content-Type: application/json');
        echo json_encode(['type'=>'success', 'message'=>'O teu voto foi confirmado. Obrigado pela participação.']);
        exit();
    }

    public function addGridPage()
    {
        $url = '/grid';
        $filename = 'grid.md';
        try {
            /** @var Pages $pages */
            $pages = $this->grav['pages'];
            $page = $pages->dispatch($url);

            if (!$page) {
                $page = new Page;
                $page->init(new \SplFileInfo(__DIR__ . '/pages/' . $filename));
                $page->slug(basename($url));
                $pages->addPage($page, $url);
            }
        } catch (\Exception $e) {
            $this->grav['log']->error($e->getMessage());
        }
    }

    public function onFormProcessed(Event $event)
    {
        $form = $event['form'];
        $action = $event['action'];

        switch ($action) {
            case 'havas_process':
                $this->processForm($form, $event);
                break;
        }
    }

    public function onTwigInitialized()
    {
        $twig = $this->grav['twig'];

        $form_class_variables = [
            //            'form_outer_classes' => 'form-horizontal',
            'form_button_outer_classes' => 'button-wrapper flex',
            'form_button_classes' => 'btn',
            'form_errors_classes' => '',
            'form_field_outer_classes' => 'form-group',
            'form_field_outer_label_classes' => 'form-label-wrapper',
            'form_field_label_classes' => 'form-label',
            //            'form_field_outer_data_classes' => 'col-9',
            'form_field_input_classes' => '',
            'form_field_textarea_classes' => '',
            'form_field_select_classes' => '',
            'form_field_radio_classes' => 'form-radio',
            'form_field_checkbox_classes' => 'form-checkbox',
        ];

        $twig->twig_vars = array_merge($twig->twig_vars, $form_class_variables);
    }

    public static function getTeams()
    {
        /** @var Config $config */
        $config = Grav::instance()['config'];
        $team = $config->get('site')['team'];
        return array_combine($team, $team);
    }

    /**
     * @param Form $form
     * @param $event
     */
    public function processForm($form, $event)
    {
        $form->validate();

        /** @var Flex $flex */
        $flex = $this->grav['flex'];

        /** @var FlexDirectory $dir */
        $dir = $flex->getDirectory('contacts');

        /** @var array $data */
        $data = $form->getData()->toArray();
        $data['likes'] = 0;
        $data['published'] = false;
        $image = reset($data['image']);

        if (!$image) {
            $this->grav->fireEvent('onFormValidationError', new Event([
                'form'    => $form,
                'message' => 'Para participares tens que fazer upload da fotografia da tua árvore de Natal.'
            ]));
            $event->stopPropagation();
            return false;
        }

        $format_img = str_replace('user/pages/upload/', '', $image['path']);

        $image['path'] = $format_img;

        $data['image'] = [$format_img => $image];
        $data['date'] = date("d-m-Y H:i");

        $obj = $dir->createObject($data, '', false);
        $obj->save();

        /** @var UniformResourceLocator $loc */
        $loc = $this->grav['locator'];
        $media_save_path = $loc->findResource($dir->getStorageFolder($obj->getStorageKey()), false);

        try {
            /** @var FormFlash $flash */
            $flash = $form->getFlash();
            $obj->update($data, $flash->getFilesByFields(true));
            $obj->save();

            if ($obj instanceof FlexObjectInterface) {
                $flash->clearFiles();
                $flash->save();
            }
        } catch (\Exception $e) {
            $form->setMessage($e->getMessage(), 'error');
            return false;
        }

        return true;
    }
}
